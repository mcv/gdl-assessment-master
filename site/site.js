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
  }

  function navigateTo(pageId) {
    d.querySelectorAll('section').forEach((section) => {
      section.className = section.id === pageId ? 'active' : '';
    });
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

