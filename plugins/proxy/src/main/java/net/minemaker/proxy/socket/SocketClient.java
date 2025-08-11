package net.minemaker.proxy.socket;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import net.minemaker.proxy.Proxy;
import net.minemaker.proxy.socket.messages.SocketMessage;
import net.minemaker.proxy.socket.messages.SocketMessageType;
import org.newsclub.net.unix.AFUNIXServerSocket;
import org.newsclub.net.unix.AFUNIXSocket;
import org.newsclub.net.unix.AFUNIXSocketAddress;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class SocketClient {
    public final Gson gson = new Gson();
    private final File socketFile;
    private final Proxy proxy;
    private final ExecutorService readExecutor = Executors.newSingleThreadExecutor();
    private AFUNIXSocket socket;
    private BufferedReader reader;
    private BufferedWriter writer;
    private Consumer<Void> onConnect;
    private BiConsumer<SocketMessageType, JsonObject> onMessage;
    private Consumer<Exception> onError;
    private Consumer<Void> onDisconnect;

    private volatile boolean running = false;

    public SocketClient(File socketFile, Proxy proxy) {
        this.proxy = proxy;
        this.socketFile = socketFile;
    }

    public void setOnConnect(Consumer<Void> onConnect) {
        this.onConnect = onConnect;
    }

    public void setOnMessage(BiConsumer<SocketMessageType, JsonObject> onMessage) {
        this.onMessage = onMessage;
    }

    public void setOnError(Consumer<Exception> onError) {
        this.onError = onError;
    }

    public void setOnDisconnect(Consumer<Void> onDisconnect) {
        this.onDisconnect = onDisconnect;
    }

    public void connect() {
        try {
            if (!socketFile.exists()) {
                throw new FileNotFoundException("socket file does not exist: " + socketFile.getAbsolutePath());
            }

            socket = AFUNIXSocket.newInstance();
            socket.connect(AFUNIXSocketAddress.of(socketFile));

            reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
            writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));

            running = true;

            if (onConnect != null) onConnect.accept(null);

            readExecutor.submit(this::readLoop);
        } catch (IOException e) {
            if (onError != null) onError.accept(e);
        }
    }

    private void readLoop() {
        try {
            String line = null;
            while (running && (line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                try {
                    JsonObject obj = gson.fromJson(line, JsonObject.class);
                    String tString = obj.get("t").getAsString();
                    SocketMessageType t = SocketMessageType.valueOf(tString);
                    JsonElement d = obj.get("d");

                    if (onMessage != null) onMessage.accept(t, d.getAsJsonObject());
                } catch (JsonSyntaxException ex) {
                    if (onError != null) onError.accept(new IOException("failed to parse JSON line: " + line, ex));
                }
            }
        } catch (IOException e) {
            if (onError != null) onError.accept(e);
        } finally {
            running = false;
            if (onDisconnect != null) onDisconnect.accept(null);
            close();
        }
    }

    public void send(SocketMessage msg) throws IOException {
        if (socket == null || socket.isClosed()) {
            throw new IOException("socket is not connected");
        }

        synchronized (writer) {
            writer.write(msg.getJsonString());
            writer.write('\n');
            writer.flush();
        }
    }

    public void close() {
        running = false;
        readExecutor.shutdownNow();
        try {
            if (reader != null) reader.close();
        } catch (IOException ignored) {
        }
        try {
            if (writer != null) writer.close();
        } catch (IOException ignored) {
        }
        try {
            if (socket != null && !socket.isClosed()) socket.close();
        } catch (IOException ignored) {
        }
    }
}
