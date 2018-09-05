(function(d) {
  // this is the simplest mockup-of our demo-site we could think of - please spend a bit more time on structuring your 
  // assessment code then we did in here ;)

  /*
   * preformatter for payload data to meet requirement by GDL specs
   */
  function formFields(form) {
    result = {};
    console.log(form.elements);
    form.elements.forEach(field => {
      result[field.name] = field.value;
    });
    console.log("formfields: ",result);
  }

  // const formCategoryMap = {
  //   "signup-step1": "sign-up",
  //   "ship-now-step1": "ship-now"
  // };
  //
  // const payloadMapping = {
  //   "sign-up": {
  //     "form-submit": {
  //
  //     }
  //   }
  // }
  function submitForm(form) {
    const success = Math.random() < .6;
    const resultElement = form.querySelector(success ? '.thanks' : '.error');
    resultElement.className += ' visible';
    setTimeout(() => {
      resultElement.className = resultElement.className.replace(/ visible/, '');
    }, 1000);

    let category = form.name;

    let eventname = success? "form-submit": "form-submit-error";

    gdl.payloadSpec(category, eventname, spec => {
      let payload = {};
      for (let key in spec.payload) {
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
    gdl.publish("pageview", "pageview", pageId);
  }

  function handleRoute(url) {
    const [ , pageId ] = /#\/(.+)$/.exec(url) || [];
    if (pageId) {
      navigateTo(pageId);
    }
  }

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

