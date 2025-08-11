package net.minemaker.proxy.socket.events;

import net.minemaker.proxy.Proxy;
import net.minemaker.proxy.socket.SocketClient;
import net.minemaker.proxy.socket.messages.ISocketData;

public abstract class SocketEventHandler<T extends ISocketData> implements ISocketEventHandler<T> {
    public Proxy proxy;
    public SocketClient client;

    public SocketEventHandler(Proxy proxy, SocketClient client) {
        this.proxy = proxy;
        this.client = client;
    }
}
