package net.minemaker.proxy.socket.messages;

import com.google.gson.JsonObject;

public class TransferPlayerMessage extends SocketMessage {
    public TransferPlayerData d;

    public TransferPlayerMessage(TransferPlayerData d) {
        super(SocketMessageType.TRANSFER_PLAYER.name(), d);
    }

    public record TransferPlayerData(String player, String id, String ip) implements ISocketData {
        @Override
        public JsonObject getJson() {
            JsonObject obj = new JsonObject();
            obj.addProperty("player", this.player);
            obj.addProperty("id", this.id);
            obj.addProperty("ip", this.ip);
            return obj;
        }
    }
}

