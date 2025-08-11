package net.minemaker.proxy.events;

import com.velocitypowered.api.event.PostOrder;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.connection.DisconnectEvent;
import com.velocitypowered.api.proxy.Player;
import net.minemaker.proxy.socket.messages.PlayerLeaveMessage;

import java.util.UUID;
import java.util.concurrent.*;

public class PlayerLeaveHandler extends EventHandler {
    public PlayerLeaveHandler(EventHandlerRegister register) {
        super(register);
    }

    @Subscribe
    public void onDisconnect(DisconnectEvent event) {
        Player player = event.getPlayer();
        UUID playerUUID = player.getUniqueId();

        register.proxy.logger.info("player left: " + playerUUID);

        try {
            PlayerLeaveMessage msg = new PlayerLeaveMessage(new PlayerLeaveMessage.PlayerLeaveData(playerUUID.toString()));
            register.proxy.socket.send(msg);
        } catch (Exception e) {
            register.proxy.logger.error("failed to send PLAYER_LEAVE", e);
        }
    }
}
