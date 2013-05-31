(function() {
  window.Backbone.sync = jasmine.createSpy('sync').andCallFake(function(method, model, options) {
    var resp;
    model.updatedByRemoteSync = true;
    if (Backbone.VERSION === '0.9.10') {
      resp = model;
      return options.success(model, resp, options);
    } else {
      return options.success(model);
    }
  });
}).call(this);
