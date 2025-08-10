package net.minemaker.proxy.Events;

import com.velocitypowered.api.event.PostOrder;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.scheduler.ScheduledTask;
import net.kyori.adventure.text.Component;
import net.minemaker.proxy.Proxy;
import net.minemaker.proxy.SocketMessageType;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class PlayerJoinHandler extends EventHandler {

    public PlayerJoinHandler(EventHandlerRegister register) {
        super(register);
    }

    @Subscribe(order = PostOrder.CUSTOM, priority = Short.MIN_VALUE)
    public void onPlayerChooseInitialServer(PlayerChooseInitialServerEvent event) {
        Player player = event.getPlayer();
        UUID playerUUID = player.getUniqueId();

        register.proxy.logger.info("player join: " + playerUUID);

        try {
            register.proxy.socket.send(SocketMessageType.PLAYER_JOIN.name(), new Proxy.PlayerJoinData(playerUUID.toString(), player.getUsername()));
            register.proxy.logger.info("sent PLAYER_JOIN for player " + player.getUsername());
        } catch (Exception e) {
            register.proxy.logger.error("failed to send PLAYER_JOIN message", e);
        }

        CompletableFuture<RegisteredServer> future = new CompletableFuture<>();
        register.proxy.pendingTransfers.put(playerUUID, future);

        ScheduledTask timeoutTask = register.server.getScheduler().buildTask(this, () -> {
            if (!future.isDone()) {
                future.completeExceptionally(new TimeoutException("transfer timeout"));
            }
        }).delay(5000, TimeUnit.SECONDS).schedule();

        future.whenComplete((target, throwable) -> {
            timeoutTask.cancel();
            register.proxy.pendingTransfers.remove(playerUUID);

            if (throwable != null) {
                event.getPlayer().disconnect(Component.text("took too long to find a server!"));
                register.proxy.logger.warn("kicked player " + player.getUsername() + " due to transfer timeout/error");
            } else {
                event.setInitialServer(target);
                register.proxy.logger.info("forwarding player " + player.getUsername() + " to server " + target.getServerInfo().getName());
            }
        });
    }

}
