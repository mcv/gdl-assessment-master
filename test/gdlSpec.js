describe('GDL', () => {
    const eventDefs = [
        {
            "description": "Test event 1",
            "category": "test-category",
            "name": "test-name",
            "payload": { "pageId": "string" }
        },
        {
            "description": "Test event 2",
            "category": "test-category2",
            "name": "test-name2",
            "payload": { "formName": "string", "company": "string", "email": "string" }
        },
    ];

    let gdl;
    
    beforeEach(() => {
        gdl = new GDL();
    });
    
    it('should process event definitions', () => {
        gdl.processEventDefinitions(eventDefs);

        expect(gdl.handlers["test-category"]).toBeDefined();
        expect(gdl.handlers["test-category"]["test-name"]).toBeDefined();
        expect(gdl.handlers["test-category2"]).toBeDefined();
        expect(gdl.handlers["test-category2"]["test-name2"]).toBeDefined();
    });
    
    it('should queue handlers for subscription when eventdefinitions are unknown', () => {
        let handled = false;
        let handler = event => {handled = true};
        gdl.subscribe("test-category", "test-name", handler);
        
        expect(gdl.handlersToProcess[0].handler).toBe(handler);
        expect(handled).toBe(false);
    });

    it('should subscribe handlers for subscription when eventdefinitions are known', () => {
        let handled = false;
        let handler = event => {handled = true};

        console.log('gdl.processEventDefinitions(eventDefs);');
        gdl.processEventDefinitions(eventDefs);

        console.log('gdl.subscribe("test-category", "test-name", handler);');
        gdl.subscribe("test-category", "test-name", handler);

        expect(gdl.handlers["test-category"]["test-name"]).toContain(handler);
    });

    it('should subscribe queued handlers for subscription once eventdefinitions become available', () => {
        let handled = false;
        let handler = event => {handled = true};
        gdl.subscribe("test-category", "test-name", handler);

        expect(gdl.handlersToProcess[0].handler).toBe(handler);
        expect(gdl.handlers).toBeNull();

        gdl.processEventDefinitions(eventDefs);
        expect(gdl.handlers["test-category"]["test-name"]).toContain(handler);
    })

    it('should handle events when handlers are ready', () => {
        let handled = false;
        let handler = event => {handled = true};
        let payload = {test: "test"};

        gdl.processEventDefinitions(eventDefs);
        gdl.subscribe("test-category", "test-name", handler);

        expect(gdl.handlers["test-category"]["test-name"]).toContain(handler);

        expect(handled).toBe(false);
        gdl.publish("test-category", "test-name", payload);
        expect(handled).toBe(true);
    })

    it('should queue events while handlers are not ready', () => {
        let handled = false;
        let handler = event => {handled = true};
        gdl.subscribe("test-category", "test-name", handler);

        expect(gdl.handlersToProcess[0].handler).toBe(handler);
        expect(gdl.handlers).toBeNull();

        gdl.processEventDefinitions(eventDefs);
        expect(gdl.handlers["test-category"]["test-name"]).toContain(handler);
    })

});