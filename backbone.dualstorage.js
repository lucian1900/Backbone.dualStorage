(function() {

  'use strict';

  var S4, dualsync, localsync, onlineSync, result;

  S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  window.Store = (function() {

    Store.prototype.sep = '';

    function Store(name) {
      var store;
      this.name = name;
      store = localStorage.getItem(this.name);
      this.records = (store && store.split(',')) || [];
    }

    Store.prototype.generateId = function() {
      return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
    };

    Store.prototype.save = function() {
      return localStorage.setItem(this.name, this.records.join(','));
    };

    Store.prototype.create = function(model) {
      console.log('creating', model, 'in', this.name);
      if (!_.isObject(model)) return model;
      if (model.attributes != null) model = model.attributes;
      if (!model.id) model.id = this.generateId();
      localStorage.setItem(this.name + this.sep + model.id, JSON.stringify(model));
      this.records.push(model.id.toString());
      this.save();
      return model;
    };

    Store.prototype.update = function(model) {
      console.log('updating', model, 'in', this.name);
      localStorage.setItem(this.name + this.sep + model.id, JSON.stringify(model));
      if (!_.include(this.records, model.id.toString())) {
        this.records.push(model.id.toString());
      }
      this.save();
      return model;
    };

    Store.prototype.find = function(model) {
      console.log('finding', model, 'in', this.name);
      return JSON.parse(localStorage.getItem(this.name + this.sep + model.id));
    };

    Store.prototype.findAll = function() {
      var id, _i, _len, _ref, _results;
      console.log('findAlling');
      _ref = this.records;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        _results.push(JSON.parse(localStorage.getItem(this.name + this.sep + id)));
      }
      return _results;
    };

    Store.prototype.destroy = function(model) {
      console.log('trying to destroy', model, 'in', this.name);
      localStorage.removeItem(this.name + this.sep + model.id);
      this.records = _.reject(this.records, function(record_id) {
        return record_id === model.id.toString();
      });
      this.save();
      return model;
    };

    return Store;

  })();

  localsync = function(method, model, options) {
    var response, store;
    store = new Store(options.storeName);
    response = (function() {
      switch (method) {
        case 'read':
          if (model.id) {
            return store.find(model);
          } else {
            return store.findAll();
          }
          break;
        case 'create':
          return store.create(model);
        case 'update':
          return store.update(model);
        case 'delete':
          return store.destroy(model);
      }
    })();
    if (!options.ignoreCallbacks) {
      if (response) {
        options.success(response);
      } else {
        options.error('Record not found');
      }
    }
    return response;
  };

  result = function(object, property) {
    var value;
    if (!object) return null;
    value = object[property];
    if (_.isFunction(value)) {
      return value.call(object);
    } else {
      return value;
    }
  };

  onlineSync = Backbone.sync;

  dualsync = function(method, model, options) {
    var response, success;
    console.log('dualsync', method, model, options);
    options.storeName = result(model.collection, 'url') || result(model, 'url');
    if (result(model, 'remote') || result(model.collection, 'remote')) {
      return onlineSync(method, model, options);
    }
    if ((options.remote === false) || result(model, 'local') || result(model.collection, 'local')) {
      return localsync(method, model, options);
    }
    options.ignoreCallbacks = true;
    switch (method) {
      case 'read':
        response = localsync(method, model, options);
        if (!_.isEmpty(response)) {
          console.log('getting local', response, 'from', options.storeName);
          return options.success(response);
        } else {
          success = options.success;
          options.success = function(resp, status, xhr) {
            var i, _i, _len;
            console.log('got remote', resp, 'putting into', options.storeName);
            if (_.isArray(resp)) {
              for (_i = 0, _len = resp.length; _i < _len; _i++) {
                i = resp[_i];
                console.log('trying to store', i);
                localsync('create', i, options);
              }
            } else {
              localsync('create', model, options);
            }
            return success(resp);
          };
          return onlineSync(method, model, options);
        }
        break;
      case 'create':
        onlineSync(method, model, options);
        return localsync(method, model, options);
      case 'update':
        onlineSync(method, model, options);
        return localsync(method, model, options);
      case 'delete':
        onlineSync(method, model, options);
        return localsync(method, model, options);
    }
  };

  Backbone.sync = dualsync;

}).call(this);
