package net.minemaker.proxy.socket.messages;

import com.google.gson.JsonObject;

public class PlayerJoinMessage extends SocketMessage {
    public PlayerJoinData d;

    public PlayerJoinMessage(PlayerJoinData d) {
        super(SocketMessageType.PLAYER_JOIN.name(), d);
    }

    public record PlayerJoinData(String uuid, String username) implements ISocketData {
        @Override
        public JsonObject getJson() {
            JsonObject obj = new JsonObject();
            obj.addProperty("uuid", this.uuid);
            obj.addProperty("username", this.username);
            return obj;
        }
    }
}

