package net.minemaker.proxy;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.proxy.server.ServerInfo;
import net.minemaker.proxy.Events.EventHandlerRegister;
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
        this.socket = new SocketClient(proxyFile);

        socket.setOnConnect(v -> logger.info("socket connected to orchestrator"));
        socket.setOnDisconnect(v -> logger.info("socket disconnected"));
        socket.setOnError(ex -> logger.error("socket error: ", ex));

        socket.setOnMessage(this::handleSocketMessage);

        socket.connect();
    }

    private void handleSocketMessage(SocketClient.Message message) {
        if (message.t == null) return;

        if (message.t.equals(SocketMessageType.TRANSFER_PLAYER.name())) {
            try {
                JsonObject json = JsonParser.parseString(message.d.toString()).getAsJsonObject();
                UUID playerUUID = UUID.fromString(json.get("player").getAsString());
                String targetIp = json.get("ip").getAsString();

                Optional<Player> optPlayer = server.getPlayer(playerUUID);

                if (optPlayer.isEmpty()) {
                    logger.warn("Tried to transfer player " + playerUUID + " but they weren't found");
                    return;
                }
                Player player = optPlayer.get();

                RegisteredServer target = getServerFromIp(targetIp);

                CompletableFuture<RegisteredServer> future = pendingTransfers.get(playerUUID);
                if (future != null && !future.isDone()) {
                    future.complete(target);
                    logger.info("Completed transfer future for player " + player.getUsername() + " to server " + targetIp);
                } else {
                    player.createConnectionRequest(target).fireAndForget();
                    logger.info("Transferred player " + player.getUniqueId() + " to server " + targetIp);
                }
            } catch (Exception e) {
                logger.error("Error handling TRANSFER_PLAYER", e);
            }
        }
    }

    private RegisteredServer getServerFromIp(String ip) {
        Optional<RegisteredServer> existingServer = server.getAllServers()
                .stream()
                .filter(server -> server.getServerInfo().getAddress().getHostString().equalsIgnoreCase(ip))
                .findFirst();

        if (existingServer.isPresent()) {
            return existingServer.get();
        }

        logger.info("Registering new server for IP: " + ip);
        ServerInfo serverInfo = new ServerInfo(ip, InetSocketAddress.createUnresolved(ip, 25565));

        return server.registerServer(serverInfo);
    }

    public record PlayerJoinData(String uuid, String username) {
        public PlayerJoinData(String uuid, String username) {
            this.uuid = uuid;
            this.username = username;
        }
    }
}
