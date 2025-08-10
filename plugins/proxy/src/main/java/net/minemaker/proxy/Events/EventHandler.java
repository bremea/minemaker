package net.minemaker.proxy.Events;

public abstract class EventHandler {
    protected final EventHandlerRegister register;

    public EventHandler(EventHandlerRegister register) {
        this.register = register;
    }
}
