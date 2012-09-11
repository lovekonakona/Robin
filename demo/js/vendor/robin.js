/*
 * A web front-end MVC framework, name's robin.
 * @author lovekonakona <lovekonakona@gmail.com>
 * @version v0.1 2012-09-11 17:13:42
 */

;(function() {
    var Class = function() {
        /* Simple JavaScript Inheritance
         * By John Resig http://ejohn.org/
         * MIT Licensed.
         */
        // Inspired by base2 and Prototype
        var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
        
        // The base Class implementation (does nothing)
        Class = function() {};

        // Create a new Class that inherits from this class
        Class.extend = function(prop) {
            var _super = this.prototype;
            
            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;
            
            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn){
                        return function() {
                            var tmp = this._super;
                            
                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];
                            
                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;
                            
                            return ret;
                        };
                    })(name, prop[name]) :
                prop[name];
            }
            
            // The dummy class constructor
            Class = function () {
                // All construction is actually done in the init method
                if ( !initializing && this.init )
                    this.init.apply(this, arguments);
            }
            
            // Populate our constructed prototype object
            Class.prototype = prototype;
            
            // Enforce the constructor to be what we expect
            Class.constructor = Class;
            
            // And make this class extendable
            Class.extend = arguments.callee;
            
            return Class;
        };
        return Class;
    }();
    
    var Robin = {
        version: '0.1'
    };
    Robin.Object = Class.extend();

    Robin.Event = Robin.Object.extend({
        on: function(event, callback) {
            if (!this._events) {
                this._events = {};
            }
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(callback);
            return this;
        },
        off: function(event) {
            if (this._events && this._events[event]) {
                delete this._events[event];
            }
            return this;
        },
        trigger: function(event) {
            if (this._events && this._events[event]) {
                for (var index in this._events[event]) {
                    this._events[event][index].apply(this);
                }
            }
            return this;
        }
    });

    for (var i in Robin.Event.prototype) {
        Robin.Object.prototype[i] = Robin.Event.prototype[i];
    }

    Robin.Model = Robin.Object.extend({
        attributes: {},
        errors: {},
        set: function(attr, value) {
            this.attributes[attr] = value;
            this.trigger('change');
            this.trigger('change:' + attr);
            this.validate(attr);
            return this;
        },
        unset: function(attr) {
            if (typeof this.attributes[attr] !== 'undefined') {
                delete this.attributes[attr];
            }
            return this;
        },
        get: function(attr) {
            return this.attributes[attr];
        },
        clear: function() {
            this.attributes = {};
            return this;
        },
        validate: function() {

        },
        addError: function(attr, error) {
            if (!this.errors[attr]) {
                this.errors[attr] = [];
            }
            this.errors[attr].push(error);
            this.trigger('error');
            this.trigger('error:' + attr);
            return this;
        },
        getError: function(attr) {
            return this.errors[attr];
        },
        clearError: function(attr) {
            if (typeof this.errors[attr] !== 'undefined') {
                delete this.errors[attr];
            }
            return this;
        },
        clearErrors: function(attr) {
            if (attr) {
                return this.clearError(attr);
            }
            this.errors = {};
            return this;
        }
    });

    window.Robin = Robin;
})();
