package net.minemaker.proxy.socket.messages;

import com.google.gson.JsonObject;

public class PlayerLeaveMessage extends SocketMessage {
    public PlayerLeaveData d;

    public PlayerLeaveMessage(PlayerLeaveData d) {
        super(SocketMessageType.PLAYER_LEAVE.name(), d);
    }

    public record PlayerLeaveData(String uuid) implements ISocketData {
        @Override
        public JsonObject getJson() {
            JsonObject obj = new JsonObject();
            obj.addProperty("uuid", this.uuid);
            return obj;
        }
    }
}

