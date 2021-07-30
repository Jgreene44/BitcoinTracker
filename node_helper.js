//We need to pull these in so they can be used for API calling

var NodeHelper = require('node_helper');
var request = require('request');

//Creating the NodeHelper with all of the functions
module.exports = NodeHelper.create({
  start: function () {
    console.log('BitcoinTracker nodeHelper has been created.');
  },

  updateTracker: function (url) {
      var self = this;

      request({ url: url, method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            self.sendSocketNotification('TRACKER_RESULT', result);
          }
      });

  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'UPDATE_TRACKER') {
      this.updateTracker(payload);
    }
  }

});