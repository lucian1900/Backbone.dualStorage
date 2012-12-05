window = require('./spec_helper').window

describe 'the spec_helper context', ->
  describe 'loading backbone.dualstorage.coffee', ->
    it 'defines Backbone.Collection.prototype.syncDirty', ->
      expect(window).toBeDefined()
      expect(window.Backbone.Collection.prototype.syncDirty).toBeDefined()

  describe 'the localStorage mock', ->
    localStorage = window.localStorage

    beforeEach ->
      localStorage.clear()

    it 'implements setItem', ->
      localStorage.setItem('socks', 'two left feet')
      expect(localStorage.values.socks).toEqual('two left feet')
      localStorage.setItem('toes', 'five')
      expect(Object.keys(localStorage.values).length).toEqual(2)

    it 'implements getItem', ->
      localStorage.setItem('socks', 'two left feet')
      expect(localStorage.getItem('socks')).toEqual('two left feet')

    it 'implements removeItem', ->
      localStorage.values = coolaid: 'drink', alcohol: 'refuse'
      localStorage.removeItem('coolaid')
      expect(localStorage.values.coolaid).toBeUndefined()
      expect(Object.keys(localStorage.values).length).toEqual(1)

    it 'implements clear', ->
      localStorage.values = cuts: 'bandages'
      expect(Object.keys(localStorage.values).length).toEqual(1)
      localStorage.clear()
      expect(Object.keys(localStorage.values).length).toEqual(0)

  describe 'result behaves like _.result', ->
    it 'returns values from properties', ->
      expect(window.result {color: 'red'}, 'color').toEqual('red')
      expect(window.result {music: -> 'banjo'}, 'music').toEqual('banjo')
