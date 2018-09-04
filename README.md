# Assessment: GDL frontend software engineer
This document describes the assessment we’d like you to do, with the aim of giving us a bit more insights in your 
abilities, development approach, and motivations to take this role.

The assessment consists of two parts.

1. **The development case:** A coding assignment, to prepare in your own time; and intended to take about 4 hours.
2. **A short motivation note:** what appeals to you in this role?

You will be invited back to TNT Digital to present and discuss your case.

If you have any questions, or something is unclear about this assessment, please reach out to us at 
erik.hagreis@tnt-digital.com.

## Development case: implement a pub/sub system
Essentially what we would like to see a small, very MVP implementation for a GDL-like libary, in working order. At the 
heart of this should be a pub/sub system, which ingests events sent by applications, and allows handling them in 
multiple platforms. We would like you to show us how you would set up this core functionality and demonstrate it with a
very simple mock 'SPA' and its accompanying event definition we have supplied with this assignment.

Your solution should cover the following requirements:

### Event handling
Set up a pub/sub system through which each event is routed. Every event has three properties. A `category`, a `name`
(both `String`) and a `payload` (an `Object`). As a result, your `publish` function could have the following signature:

```javascript
/**
 * Publishes an event in this GDL-like library.
 *
 * @param category {String}
 * @param name {String}
 * @param payload {Object}
 * @return void
 */
const publish = (category, name, payload) => { 
  // your implementation here.
};
```

This function should handle events as follows:
* Subscribers must call two platforms: GA and Relay42. The rules are:
  * Pageview events must call the `window.ga.pageview` stub function
  * Other events must call the `window.ga.event stub`, _and_ the `window.relay42.engagement` stub.
* The library should somehow use the bundled event definitions (`./defs/eventdefinitions.json`) - ie load them or use
a bundler to bake them into the library. The data in this JSON can be traversed in order to register subscribers, and 
can also be looked up while handling an event, for example for event validation. You could also add extra information to 
the JSON file about each event. This is possible but not strictly necessary for this assessment.
* In a real-life situation, it is expected that the library must perform transformations on incoming payloads, in order
to comply with the specification of the target platforms. For bonus points, you can show how you would handle these
platform-specific payload transformations, but this is optional.

### Status monitoring
We need to understand what occurs in run-time in our library. To accomplish this, store the runtime state of the pub/sub 
system in a way it can be inspected within the browser, _and_ it should be possible (in a later story) to offload this
data to an endpoint. It should keep track of all the events which have passed through the system. 

By inspecting the state, we must at least be able to understand:
* A list of all events that were published
* Which events were not recognised by the pub/sub system
* Which events resulted in an error (note that the ga and relay42 stubs are designed to occasionally fail)

### Demo site
* Using the bundled mock microsite, implement your solution
* Show us how you see the integration between the GDL library, and the implementing website
* How tight is the coupling between the library and the website?
* Note that also the 3rd-party (mock) libraries `ga.js` and `relay42.js` must be included somehow

### Other
* To facilitate in-browser debugging / monitoring, create some useful console output
* Write some unit tests - 100% coverage not required, but cover the essentials please
* Use 3rd-party modules at your own discretion
* Use of build setup, module bundlers, etc also to your own liking
* This assignment should pose relatively little technical difficulty while allowing you to showcase how you would go 
about structuring your solution in an extensible way.
* Being compatible with older-generation browsers is entirely optional for this exercise

## Motivation note
The role of engineer within the GDL team at TNT might differ from 'the usual' the front-end positions, which are mainly
about customer-facing product development. Helping design and building a library used by internal stakeholders is a 
somewhat different game (even if it does also involve building a user interface somewhere as well - this is not the most
prominent task). 

We are interested to understand how you view this role. For example: where you think you can immediately add value, in
what area's do you think working on this project will help you grow as a professional. What interesting problems do you 
look forward to tackling?

Please spend a little time thinking of these aspects of the role we have on offer, and write down your conclusions in a 
short note; no need for a big essay. We believe this will help us match with a skilled _and_ motivated candidate to do
some great things with us.
