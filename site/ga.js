(function(w) {
  // stub version of a google analytics-like library.

  w.ga = {
    pageview: (path) => { maybeFail('ga.pageview'); },
    event: (category, action, label = '', value = 0, dimensions = {}) => { maybeFail('ga.event'); },
  }

  function maybeFail(what = 'unknown', odds = 0.25) {
    if (Math.random() < odds) {
      throw new Error(`An error ocurred in ${what}.`);
    }
  }
})(window);
