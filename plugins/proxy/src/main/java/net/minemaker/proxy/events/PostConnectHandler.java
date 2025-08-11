package net.minemaker.proxy.events;

import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.ServerPostConnectEvent;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.ServerConnection;
import com.velocitypowered.api.proxy.server.ServerInfo;
import net.minemaker.proxy.socket.messages.TransferCompleteMessage;

import java.util.Optional;
import java.util.UUID;

public class PostConnectHandler extends EventHandler {
    public PostConnectHandler(EventHandlerRegister register) {
        super(register);
    }

    @Subscribe
    public void onServerPostConnect(ServerPostConnectEvent event) {
        Player player = event.getPlayer();
        UUID playerUUID = player.getUniqueId();
        Optional<ServerConnection> server = player.getCurrentServer();

        if (server.isEmpty()) {
            register.proxy.logger.error("Server empty?");
            return;
        }

        ServerInfo serverInfo = server.get().getServerInfo();

        try {
            TransferCompleteMessage msg = new TransferCompleteMessage(new TransferCompleteMessage.TransferCompleteData(playerUUID.toString(), serverInfo.getName()));
            register.proxy.socket.send(msg);
        } catch (Exception e) {
            register.proxy.logger.error("failed to send TRANSFER_COMPLETE", e);
        }
    }

}
