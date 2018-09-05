class GaWrapper {
    static pageview(event) {
        return window.ga.pageview(event.payload.pageId);
    }
    
    static event(event) {
        let label = '';
        if (event.payload.formName) {
            label = event.payload.formName;
        }
        else if (event.payload.linkName) {
            label = event.payload.linkName
        }
        return window.ga.event(event.category, event.name, label);
    }
}