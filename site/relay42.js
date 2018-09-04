(function(w) {
  // stub version of a relay42-like library.

  w.relay42 = {
    sendEngagement: (name, data = {}) => { maybeFail('relay42.engagement'); },
  }

  function maybeFail(what = 'unknown', odds = 0.25) {
    if (Math.random() < odds) {
      throw new Error(`An error ocurred in ${what}.`);
    }
  }
})(window);
