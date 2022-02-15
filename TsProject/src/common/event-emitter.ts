
export interface Listener {
    (...args: any): void;
}

export default class EventEmitter {
    
    private map = new Map<string, Array<Listener>>();

    public on(eventName: string, listener: Listener) {
        if (this.map.has(eventName)) {
            this.map.get(eventName).push(listener);
        } else {
            this.map.set(eventName, [listener]);
        }
    }

    public off(eventName: string, listener: Listener) {
        if (this.map.has(eventName)) {
            const listeners = this.map.get(eventName);
            listeners.splice(listeners.indexOf(listener) >>> 0, 1);
        }
    }

    public emit(eventName: string, ...args: any[]) {
        if (this.map.has(eventName)) {
            this.map.get(eventName).forEach(it => {
                it(args);
            })
        }
    }
}