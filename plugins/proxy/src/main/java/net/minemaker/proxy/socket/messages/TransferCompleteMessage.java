package net.minemaker.proxy.socket.messages;

import com.google.gson.JsonObject;

public class TransferCompleteMessage extends SocketMessage {
    public TransferCompleteData d;

    public TransferCompleteMessage(TransferCompleteData d) {
        super(SocketMessageType.TRANSFER_COMPLETE.name(), d);
    }

    public record TransferCompleteData(String player, String instance) implements ISocketData {
        @Override
        public JsonObject getJson() {
            JsonObject obj = new JsonObject();
            obj.addProperty("player", this.player);
            obj.addProperty("instance", this.instance);
            return obj;
        }
    }
}

