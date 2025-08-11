package net.minemaker.proxy.events;

public abstract class EventHandler {
    protected final EventHandlerRegister register;

    public EventHandler(EventHandlerRegister register) {
        this.register = register;
    }
}
