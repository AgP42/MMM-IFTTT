/* global Module */

Module.register('MMM-IFTTT',{

    /**
     * Module config defaults
     */
    defaults: {
        displaySeconds: 60,
        fadeSpeed: 3000,
        size: 'large'
    },

    /**
     * @var {Object}
     */
    currentNotification: null,

    /**
     * @var {Integer}
     */
    currentTimeout: null,

    /**
     * Starting of the module
     */
    start: function() {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('START', {message: 'start connection'});
    },

    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'IFTTT_NOTIFICATION') {
            var fadeSpeed = this.currentNotification.fadeSpeed || this.config.fadeSpeed;
            this.currentNotification = payload;
            this.updateDom(fadeSpeed);
        }
    },

    /**
     * @returns {*}
     */
    getDom: function() {
        var message = '';
        if (this.currentNotification !== null) {
            message = this.currentNotification.message;

            // Talk to the PiLights Module
            if (typeof this.currentNotification.lightSequence !== 'undefined') {
                this.sendNotification('PILIGHTS_SEQUENCE', this.currentNotification.lightSequence);
            }

            // Set timeout to hide this soon, but first clear the existing timeout
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }

            // Message
            var display_ms = (this.currentNotification.displaySeconds || this.defaults.displaySeconds) * 1000;
            var fadeSpeed  = this.currentNotification.fadeSpeed || this.config.fadeSpeed;
            var self       = this;

            this.currentTimeout = setTimeout(function () {
                self.currentNotification = null;
                self.currentTimeout = null;
                self.updateDom(fadeSpeed);
            }, display_ms);
        }

        var wrapper = document.createElement('div');
        wrapper.className = 'thin bright ' + this.config.size;
        wrapper.appendChild(document.createTextNode(message));

        return wrapper;
    }
});