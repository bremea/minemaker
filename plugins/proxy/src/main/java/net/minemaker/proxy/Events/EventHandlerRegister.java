package net.minemaker.proxy.Events;

import com.velocitypowered.api.proxy.ProxyServer;
import net.minemaker.proxy.Proxy;

public class EventHandlerRegister {
    public Proxy proxy;
    public ProxyServer server;

    public EventHandlerRegister(Proxy proxy, ProxyServer server) {
        this.proxy = proxy;
        this.server = server;
    }

    public void registerEvents() {
        PlayerJoinHandler playerJoinHandler = new PlayerJoinHandler(this);
        server.getEventManager().register(proxy, playerJoinHandler);
    }
}
