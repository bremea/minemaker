package net.minemaker.proxy.events;

import com.velocitypowered.api.event.EventTask;
import com.velocitypowered.api.event.PostOrder;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import net.kyori.adventure.text.Component;
import net.minemaker.proxy.socket.messages.PlayerJoinMessage;

import java.util.UUID;
import java.util.concurrent.*;

public class PlayerJoinHandler extends EventHandler {
    private final long transferTimeoutMillis = 5000;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public PlayerJoinHandler(EventHandlerRegister register) {
        super(register);
    }

    @Subscribe(order = PostOrder.FIRST)
    public EventTask onPlayerChooseInitialServer(PlayerChooseInitialServerEvent event) {
        Player player = event.getPlayer();
        UUID playerUUID = player.getUniqueId();

        register.proxy.logger.info("player join: " + playerUUID);

        try {
            PlayerJoinMessage joinMessage = new PlayerJoinMessage(new PlayerJoinMessage.PlayerJoinData(playerUUID.toString(), player.getUsername()));
            register.proxy.socket.send(joinMessage);
            register.proxy.logger.info("sent PLAYER_JOIN for player " + player.getUsername());
        } catch (Exception e) {
            register.proxy.logger.error("failed to send PLAYER_JOIN message", e);
        }

        CompletableFuture<RegisteredServer> transferFuture = new CompletableFuture<>();
        register.proxy.pendingTransfers.put(player.getUniqueId(), transferFuture);

        return EventTask.withContinuation(continuation -> {
            scheduler.schedule(() -> {
                if (!transferFuture.isDone()) {
                    transferFuture.completeExceptionally(new TimeoutException("transfer timed out"));
                }
            }, transferTimeoutMillis, TimeUnit.MILLISECONDS);

            transferFuture.whenComplete((targetServer, throwable) -> {
                try {
                    if (throwable != null) {
                        register.proxy.logger.error(throwable.getMessage());
                        player.disconnect(Component.text(throwable.getMessage()));
                    } else {
                        event.setInitialServer(targetServer);
                    }
                } finally {
                    continuation.resume();
                }
            });
        });
    }
}
