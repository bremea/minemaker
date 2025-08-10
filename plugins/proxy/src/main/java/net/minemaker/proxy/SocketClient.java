package net.minemaker.proxy;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.newsclub.net.unix.AFUNIXSocket;
import org.newsclub.net.unix.AFUNIXSocketAddress;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class SocketClient {
    private final File socketFile;
    private final Gson gson = new Gson();
    private final ExecutorService readExecutor = Executors.newSingleThreadExecutor();
    private AFUNIXSocket socket;
    private BufferedReader reader;
    private BufferedWriter writer;
    private Consumer<Void> onConnect;
    private Consumer<Message> onMessage;
    private Consumer<Exception> onError;
    private Consumer<Void> onDisconnect;

    private volatile boolean running = false;

    public SocketClient(File socketFile) {
        this.socketFile = socketFile;
    }

    public void setOnConnect(Consumer<Void> onConnect) {
        this.onConnect = onConnect;
    }

    public void setOnMessage(Consumer<Message> onMessage) {
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
            socket.connect(new AFUNIXSocketAddress(socketFile));

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
            String line;
            while (running && (line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                try {
                    Message msg = gson.fromJson(line, Message.class);
                    if (onMessage != null) onMessage.accept(msg);
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

    public void send(String type, Object data) throws IOException {
        if (socket == null || socket.isClosed()) {
            throw new IOException("socket is not connected");
        }
        Message msg = new Message(type, data);
        String json = gson.toJson(msg);
        synchronized (writer) {
            writer.write(json);
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

    public static class Message {
        public String t;
        public Object d;

        public Message(String t, Object d) {
            this.t = t;
            this.d = d;
        }
    }
}
