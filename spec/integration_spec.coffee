{collection, model} = {}

beforeEach ->
  window.onlineSync.calls = []
  window.localsync 'clear', {}, ignoreCallbacks: true, storeName: 'eyes/'
  collection = new Backbone.Collection
    id: 123
    vision: 'crystal'
  collection.url = 'eyes/'
  model = collection.models[0]

describe 'using Backbone.sync directly', ->
  it 'should save and retrieve data', ->
    localStorage.clear()
    successCallback = jasmine.createSpy('success')
    errorCallback = jasmine.createSpy('error')
    window.dualsync 'create', model, success: successCallback, error: errorCallback
    expect(window.onlineSync.calls.length).toEqual(1)
    expect(successCallback).toHaveBeenCalled()
    expect(errorCallback).not.toHaveBeenCalled()
    expect(window.localStorage.length).toBeGreaterThan(0)

    successCallback = jasmine.createSpy('success').andCallFake (resp) ->
      expect(resp.get('vision')).toEqual('crystal')
    errorCallback = jasmine.createSpy('error')
    window.dualsync 'read', model, success: successCallback, error: errorCallback
    expect(window.onlineSync.calls.length).toEqual(2)
    expect(successCallback).toHaveBeenCalled()
    expect(errorCallback).not.toHaveBeenCalled()

describe 'using backbone models and retrieving from local storage', ->
  it "fetches a model after saving it", ->
    saved = false
    runs ->
      model.save {}, success: -> saved = true
    waitsFor (-> saved), "The success callback for 'save' should have been called", 100
    fetched = false
    retrievedModel = new Backbone.Model id: 123
    retrievedModel.collection = collection
    runs ->
      retrievedModel.fetch remote: false, success: -> fetched = true
    waitsFor (-> fetched), "The success callback for 'fetch' should have been called", 100
    runs ->
      expect(retrievedModel.get('vision')).toEqual('crystal')

describe 'using backbone collections and retrieving from local storage', ->
  it 'loads a collection after adding several models to it', ->
    saved = 0
    runs ->
      for id in [1..3]
        newModel = new Backbone.Model id: id
        newModel.collection = collection
        newModel.save {}, success: -> saved += 1
      waitsFor (-> saved == 3), "The success callback for 'save' should have been called for id ##{id}", 100
    fetched = false
    runs ->
      collection.fetch remote: false, success: -> fetched = true
    waitsFor (-> fetched), "The success callback for 'fetch' should have been called", 100
    runs ->
      expect(collection.length).toEqual(3)
      expect(collection.map (model) -> model.id).toEqual [1,2,3]
