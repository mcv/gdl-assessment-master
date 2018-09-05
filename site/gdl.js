class GDL {

    constructor() {
        this.handlers = null;
        this.handlersToProcess = [];
        this.eventsToProcess = [];
        this.publishedEvents = [];
        this.requestedPayloadDefinitions = [];
        console.log("constructor");
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
        console.log("subscribe");
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
        console.log("subscribe events: ", this.handlersToProcess);
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
        let event = new GdlEvent(category, name, payload);
        this.publishedEvents.push(event);
        if (this.handlers) {
            this.publishGdlEvent(event);
        }
    };

    publishGdlEvent(event) {
        console.log("publish directly", this.handlers[event.category][event.name].hander);
        if (this.handlers[event.category] && this.handlers[event.category][event.name]) {
            let handlers = this.handlers[event.category][event.name];
            handlers.forEach(handler => handler(event));
        }
        else {
            console.warn("unknown event: ",event);
        }

    }

    publishQueuedEvents() {
        console.log("publishQueuedEvents: ", this.publishedEvents);
        this.publishedEvents.forEach(event => this.publishGdlEvent(event));
    }

    /**
     * Calls async callback with payload specifications for requested event type
     *
     * @param category {String}
     * @param name {String}
     * @param callback {Function}
     */
    payloadSpec(category, name, callback) {
        if (this.eventDefinitions) {
            this.sendPayloadDefinition(category, name, callback);
        }
        else {
            this.requestedPayloadDefinitions.push({category: category, name: name, callback: callback});
        }
    }

    sendPayloadDefinition(category, name, callback) {
        console.log(category, name);
        console.log("eventDefinitions: ",this.eventDefinitions);
        let definition = this.eventDefinitions.find(def => def.category === category && def.name === name);
        this.eventDefinitions.forEach(def => {
            console.log(def.category, def.name, def.category === category && def.name === name);
        })
        console.log("found definition: ",definition);
        callback(definition);
    }

    sendRequestedPayloadDefinitions() {
        this.requestedPayloadDefinitions.forEach(def => {
            sendPayloadDefinition(def.category, def.name, def.callback);
        });
    }

    fetchEventDefs() {
        console.log("this: ",this);
        fetch("../defs/eventdefinitions.json", { headers: { "Content-Type": "application/json; charset=utf-8" }})
            .then(res => res.json())
            .then(res => this.processEventDefinitions(res))
            .catch(err => {
                console.log("error: ",err);
                alert("cannot find event definitions");
            });
    }

    processEventDefinitions(response) {
        console.log("response: ", response);
        console.log("this2: ",this);
        this.eventDefinitions = response;
        console.log("defs: ",this.eventDefinitions);
        this.initiateHandlers(response);
        this.registerEventHandlers();
        this.publishQueuedEvents();
        this.sendRequestedPayloadDefinitions();
    }

    initiateHandlers(eventDefs) {
        this.handlers = {};
        console.log("defs2: ",this.eventDefinitions);
        console.log("defs3: ",eventDefs);
        eventDefs.forEach (def => {
            console.log("def: ",def);
            if (!this.handlers[def.category]) {
                this.handlers[def.category] = {};
            }
            this.handlers[def.category][def.name] = [];
        });

    }
}