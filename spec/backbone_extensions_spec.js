// Generated by CoffeeScript 1.6.2
(function() {
  describe('monkey patching', function() {
    return it('aliases Backbone.sync to backboneSync', function() {
      expect(window.backboneSync).toBeDefined();
      return expect(window.backboneSync.identity).toEqual('sync');
    });
  });

  describe('offline localStorage sync', function() {
    var collection;

    collection = {}.collection;
    beforeEach(function() {
      window.localStorage.clear();
      window.localStorage.setItem('cats', '2,3');
      window.localStorage.setItem('cats_dirty', '2');
      window.localStorage.setItem('cats_destroyed', '3');
      window.localStorage.setItem('cats3', '{"id": "2", "color": "auburn"}');
      window.localStorage.setItem('cats3', '{"id": "3", "color": "burgundy"}');
      collection = new window.Backbone.Collection([
        {
          id: 2,
          color: 'auburn'
        }, {
          id: 3,
          color: 'burgundy'
        }
      ]);
      return collection.url = function() {
        return 'cats';
      };
    });
    describe('syncDirtyAndDestroyed', function() {
      return it('calls syncDirty and syncDestroyed', function() {
        var syncDestroyed, syncDirty;

        syncDirty = spyOn(window.Backbone.Collection.prototype, 'syncDirty');
        syncDestroyed = spyOn(window.Backbone.Collection.prototype, 'syncDestroyed');
        collection.syncDirtyAndDestroyed();
        expect(syncDirty).toHaveBeenCalled();
        return expect(syncDestroyed).toHaveBeenCalled();
      });
    });
    describe('syncDirty', function() {
      return it('finds and saves all dirty models', function() {
        var save;

        save = spyOn(collection.get(2), 'save').andCallThrough();
        collection.syncDirty();
        expect(save).toHaveBeenCalled();
        return expect(window.localStorage.getItem('cats_dirty')).toBeFalsy();
      });
    });
    describe('syncDestroyed', function() {
      return it('finds all models marked as destroyed and destroys them', function() {
        var destroy;

        destroy = spyOn(collection.get(3), 'destroy');
        collection.syncDestroyed();
        return expect(window.localStorage.getItem('cats_destroyed')).toBeFalsy();
      });
    });
    return describe('with collection url as function', function() {
      beforeEach(function() {
        window.localStorage.clear();
        window.localStorage.setItem('cats', '2,3');
        window.localStorage.setItem('cats_dirty', '2');
        window.localStorage.setItem('cats_destroyed', '3');
        window.localStorage.setItem('cats3', '{"id": "2", "color": "auburn"}');
        window.localStorage.setItem('cats3', '{"id": "3", "color": "burgundy"}');
        collection = new window.Backbone.Collection([
          {
            id: 2,
            color: 'auburn'
          }, {
            id: 3,
            color: 'burgundy'
          }
        ]);
        return collection.url = function() {
          return 'cats';
        };
      });
      describe('syncDirty', function() {
        return it('finds and saves all dirty models', function() {
          var save;

          save = spyOn(collection.get(2), 'save').andCallThrough();
          collection.syncDirty();
          expect(save).toHaveBeenCalled();
          return expect(window.localStorage.getItem('cats_dirty')).toBeFalsy();
        });
      });
      return describe('syncDestroyed', function() {
        return it('finds all models marked as destroyed and destroys them', function() {
          var destroy;

          destroy = spyOn(collection.get(3), 'destroy');
          collection.syncDestroyed();
          return expect(window.localStorage.getItem('cats_destroyed')).toBeFalsy();
        });
      });
    });
  });

}).call(this);
