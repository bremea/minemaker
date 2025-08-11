package net.minemaker.proxy.socket.messages;

import com.google.gson.JsonObject;

public abstract class SocketMessage {
    public String t;
    public ISocketData d;

    public SocketMessage(String t, ISocketData d) {
        this.t = t;
        this.d = d;
    }

    public String getJsonString() {
        JsonObject obj = new JsonObject();
        obj.addProperty("t", this.t);
        obj.add("d", this.d.getJson());
        return obj.toString();
    }
}
