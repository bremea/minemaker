package net.minemaker.proxy.socket.events;

import com.google.gson.JsonObject;
import net.minemaker.proxy.Proxy;
import net.minemaker.proxy.socket.SocketClient;
import net.minemaker.proxy.socket.messages.TransferPlayerMessage;
import net.minemaker.proxy.socket.messages.SocketMessageType;

import java.util.HashMap;

public class SocketEventHandlerRegister {
    public Proxy proxy;
    public SocketClient client;
    public HashMap<SocketMessageType, SocketEventHandler> handlers = new HashMap<>();

    public SocketEventHandlerRegister(Proxy proxy, SocketClient client) {
        this.proxy = proxy;
        this.client = client;

        client.setOnMessage(this::handleSocketMessage);
        handlers.put(SocketMessageType.TRANSFER_PLAYER, new TransferPlayerHandler(proxy, client));
    }

    private void handleSocketMessage(SocketMessageType t, JsonObject d) {
        SocketEventHandler handler = handlers.get(t);

        if (handler == null) {
            proxy.logger.error("No handler found for message type " + t.toString());
        } else {
            handler.handle(handler.parse(d));
        }
    }
}
