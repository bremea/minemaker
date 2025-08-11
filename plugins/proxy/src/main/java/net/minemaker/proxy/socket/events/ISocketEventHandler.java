package net.minemaker.proxy.socket.events;

import com.google.gson.JsonObject;
import net.minemaker.proxy.socket.messages.ISocketData;

public interface ISocketEventHandler<T extends ISocketData> {
    public T parse(JsonObject obj);
    public void handle(T data);
}
