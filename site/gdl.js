class GDL {

    constructor() {
        this.handlers = null;
        this.handlersToProcess = [];
        this.eventsToProcess = [];
        this.publishedEvents = [];
        this.requestedPayloadDefinitions = [];
        this.unknownEvents = [];
        this.fetchEventDefs();
    }
    /**
     * Subscribes an event consumer to the specified events.
     *
     * @param category {String}
     * @param name {String}
     * @param payload {Object}
     * @return void
     */
    subscribe (category, name, handler) {
        let eventHandler = new EventHandler(category, name, handler);
        if (this.handlers) {
            // if handlers is ready to receive handlers, subscribe event handler
            this.registerEventHandler(eventHandler);
        }
        else {
            // if handlers object is not ready, store subscription to be handled later
            this.handlersToProcess.push(eventHandler);
        }
    }

    registerEventHandler (eventHandler) {
        if (this.handlers[eventHandler.category] && this.handlers[eventHandler.category][eventHandler.name]) {
            this.handlers[eventHandler.category][eventHandler.name].push(eventHandler.handler);
        }
    }

    registerEventHandlers () {
        this.handlersToProcess.forEach(handler => this.registerEventHandler(handler));
    }



    /**
     * Publishes an event in this GDL-like library.
     *
     * @param category {String}
     * @param name {String}
     * @param payload {Object}
     * @return void
     */
    publish (category, name, payload) {
        console.log("publish: ",category, name, payload);
        let event = new GdlEvent(category, name, payload);
        this.publishedEvents.push(event);
        if (this.handlers) {
            this.publishGdlEvent(event);
        }
    };

    publishGdlEvent(event) {
        if (this.handlers[event.category] && this.handlers[event.category][event.name]) {
            let handlers = this.handlers[event.category][event.name];
            handlers.forEach(handler => handler(event));
        }
        else {
            console.warn("unknown event: ",event);
            this.unknownEvents.push(event);
        }

    }

    publishQueuedEvents() {
        this.publishedEvents.forEach(event => this.publishGdlEvent(event));
    }

    /**
     * Request the definition of the payload for a event type
     * If event definitions are available, it calls async callback with the payload definition
     * for the requested event type.
     * If event definitions are not available, queue the request and call the callback once the
     * definition is available.
     *
     * @param category {String}
     * @param name {String}
     * @param callback {Function}
     */
    payloadDefinition(category, name, callback) {
        if (this.eventDefinitions) {
            this.sendPayloadDefinition(category, name, callback);
        }
        else {
            this.requestedPayloadDefinitions.push({category: category, name: name, callback: callback});
        }
    }

    sendPayloadDefinition(category, name, callback) {
        let definition = this.eventDefinitions.find(def => def.category === category && def.name === name);
        callback(definition);
    }

    sendRequestedPayloadDefinitions() {
        this.requestedPayloadDefinitions.forEach(def => {
            sendPayloadDefinition(def.category, def.name, def.callback);
        });
    }

    fetchEventDefs() {
        fetch("../defs/eventdefinitions.json", { headers: { "Content-Type": "application/json; charset=utf-8" }})
            .then(res => res.json())
            .then(res => this.processEventDefinitions(res))
            .catch(err => {
                console.log("error: ",err);
                alert("cannot find event definitions");
            });
    }

    processEventDefinitions(response) {
        this.eventDefinitions = response;
        this.initiateHandlers(response);
        this.registerEventHandlers();
        this.publishQueuedEvents();
        this.sendRequestedPayloadDefinitions();
    }

    initiateHandlers(eventDefs) {
        this.handlers = {};
        eventDefs.forEach (def => {
            if (!this.handlers[def.category]) {
                this.handlers[def.category] = {};
            }
            this.handlers[def.category][def.name] = [];
        });

    }
}