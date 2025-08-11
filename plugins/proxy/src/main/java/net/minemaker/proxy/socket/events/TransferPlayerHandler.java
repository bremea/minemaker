package net.minemaker.proxy.socket.events;

import com.google.gson.JsonObject;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import net.minemaker.proxy.Proxy;
import net.minemaker.proxy.socket.SocketClient;
import net.minemaker.proxy.socket.messages.TransferPlayerMessage;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class TransferPlayerHandler extends SocketEventHandler<TransferPlayerMessage.TransferPlayerData> {
    public TransferPlayerHandler(Proxy proxy, SocketClient client) {
        super(proxy, client);
    }

    @Override
    public TransferPlayerMessage.TransferPlayerData parse(JsonObject obj) {
        return client.gson.fromJson(obj, TransferPlayerMessage.TransferPlayerData.class);
    }

    @Override
    public void handle(TransferPlayerMessage.TransferPlayerData data) {
        UUID playerUUID = UUID.fromString(data.player());
        String targetId = data.id();
        String targetIp = data.ip();

        Optional<Player> optPlayer = proxy.server.getPlayer(playerUUID);

        if (optPlayer.isEmpty()) {
            proxy.logger.warn("tried to transfer player " + data.player() + " but they weren't found");
            return;
        }
        Player player = optPlayer.get();

        RegisteredServer target = proxy.getServer(targetId, targetIp);

        CompletableFuture<RegisteredServer> future = proxy.pendingTransfers.remove(playerUUID);
        if (future != null && !future.isDone()) {
            future.complete(target);
            proxy.logger.info("completed transfer future for player " + player.getUsername() + " to server " + targetId);
        } else {
            player.createConnectionRequest(target).fireAndForget();
            proxy.logger.info("transferred player " + player.getUniqueId() + " to server " + targetId);
        }
    }
}
