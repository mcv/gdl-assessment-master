(function(d) {
  // this is the simplest mockup-of our demo-site we could think of - please spend a bit more time on structuring your 
  // assessment code then we did in here ;)

  function submitForm(form) {
    const success = Math.random() < .6;
    const resultElement = form.querySelector(success ? '.thanks' : '.error');
    resultElement.className += ' visible';
    setTimeout(() => {
      resultElement.className = resultElement.className.replace(/ visible/, '');
    }, 1000);

    let category = form.name;

    let eventname = success? "form-submit": "form-submit-error";

    // form payload depends on the form. we retrieve the eventdefinition to find the proper payload
    gdl.payloadDefinition(category, eventname, def => {
      let payload = {};
      for (let key in def.payload) {
        if (key === "formName") payload.formName = form.name;
        else payload[key] = form.elements[key].value;
      };

      gdl.publish(category, eventname, payload);
    });
  }

  function navigateTo(pageId) {
    d.querySelectorAll('section').forEach((section) => {
      section.className = section.id === pageId ? 'active' : '';
    });
  }

  let page = null;

  function handleRoute(url) {
    gdl.publish("pageview", "pageview", url);
    const [ , pageId ] = /#\/(.+)$/.exec(url) || [];
    if (pageId) {
      page = pageId;
      navigateTo(pageId);
    }
  }

  d.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
      gdl.publish(page, "click-link", {linkName: link.name? link.name: link.href});
    })
  });

  d.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });


  window.addEventListener('popstate', () => {
    handleRoute(document.location.href);
  });

  handleRoute(document.location.href);  

})(document);

