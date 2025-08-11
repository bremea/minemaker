package net.minemaker.proxy.events;

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
        server.getEventManager().register(proxy, new PlayerJoinHandler(this));
        server.getEventManager().register(proxy, new PlayerLeaveHandler(this));
        server.getEventManager().register(proxy, new PostConnectHandler(this));
    }
}
