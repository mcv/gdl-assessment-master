class Relay42Wrapper {
    static event(event) {
        return window.ga.event(event.name, event.payload)
    }
}