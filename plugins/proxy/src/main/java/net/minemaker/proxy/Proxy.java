package net.minemaker.proxy;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.proxy.server.ServerInfo;
import net.minemaker.proxy.events.EventHandlerRegister;
import net.minemaker.proxy.socket.SocketClient;
import net.minemaker.proxy.socket.events.SocketEventHandlerRegister;
import org.slf4j.Logger;

import java.io.File;
import java.net.InetSocketAddress;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Plugin(
        id = "proxy",
        name = "Minemaker Proxy",
        version = BuildConstants.VERSION,
        url = "minemaker.net"
)
public class Proxy {
    public final ConcurrentHashMap<UUID, CompletableFuture<RegisteredServer>> pendingTransfers = new ConcurrentHashMap<>();
    public SocketClient socket;
    public ProxyServer server;
    public Logger logger;
    private final EventHandlerRegister eventHandler;
    private SocketEventHandlerRegister socketHandler;

    @Inject
    public Proxy(ProxyServer server, Logger logger) {
        this.server = server;
        this.logger = logger;
        this.eventHandler = new EventHandlerRegister(this, server);

        logger.info("minemaker proxy initializing...");
    }


    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) {
        eventHandler.registerEvents();

        File proxyFile = new File(System.getenv("SOCKET_PATH"));
        this.socket = new SocketClient(proxyFile, this);

        socket.setOnConnect(v -> logger.info("socket connected to orchestrator"));
        socket.setOnDisconnect(v -> logger.info("socket disconnected!"));
        socket.setOnError(ex -> logger.error("socket error: ", ex));

        socket.connect();

        this.socketHandler = new SocketEventHandlerRegister(this, socket);
    }


    public RegisteredServer getServer(String name, String ip) {
        Optional<RegisteredServer> existingServer = server.getServer(name);

        if (existingServer.isPresent()) {
            return existingServer.get();
        }

        logger.info("registering new server " + name);
        ServerInfo serverInfo = new ServerInfo(name, InetSocketAddress.createUnresolved(ip, 25565));

        return server.registerServer(serverInfo);
    }
}
