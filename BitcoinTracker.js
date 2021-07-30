//Might need so it's compatible with older JS instances
//'use strict';

//Set up Bitcoin tracker
Module.register("BitcoinTracker", {

  result: {},
  defaults: {
    currency: 'usd',
    text: 'Bitcoin Price:',
    updateInterval: 60000,

    //table so we can get to the API url and get symbols for front end.
    currencyType: {
      usd: {
        symbol: '$',
        exchange: 'btcusd'
      },
      eur: {
        symbol: '€',
        exchange: 'btceur'
      }
    }
  },

  //we want our CSS styles to be pulled in as well
  getStyles: function() {
    return ["styles.css"];
  },

  //When we start we want to get the current API data and set a time when to refresh
  start: function() {
    this.getTracker();
    this.scheduleUpdate();
  },

// This is how we draw to the screen. We use DOM elements and fill them in dynamically with HTML and CSS
  getDom: function() {
    var wrapper = document.createElement("tracker");
    wrapper.className = 'medium bright';
    wrapper.className = 'tracker';

    var data = this.result;
    var symbol =  document.createElement("span");
    var currency = this.config.currency;
    var currencySymbol = this.config.currencyType[currency].symbol;
    var lastPrice = data.last;
    var text = this.config.text
    
    if (lastPrice) {
      symbol.innerHTML = text + ' ' + currencySymbol;
      wrapper.appendChild(symbol);
      var price = document.createElement("span");
      price.innerHTML = lastPrice;
      wrapper.appendChild(price);
    }
    return wrapper;
  },

  //this is to schedule the next refresh. 
  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getTracker();
    }, nextLoad);
  },


  //We are going to contact the bitstamp api and grab their data and return it and forward it
  getTracker: function () {
    var currency = this.config.currency;
    var url = 'https://www.bitstamp.net/api/v2/ticker/' + this.config.currencyType[currency].exchange + '/';
    this.sendSocketNotification('UPDATE_TRACKER', url);
  },

  //When we get the API data returned we are going to store it into the result array for this class so other variables can have access to it.
  //Then we are going to update the front end and fade it out according to the default settings
  socketNotificationReceived: function(notification, payload) {
    if (notification === "TRACKER_RESULT") {
      var self = this;
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});