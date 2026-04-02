import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'teams.index': { paramsTuple?: []; params?: {} }
    'teams.store': { paramsTuple?: []; params?: {} }
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.increment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.decrement': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inscriptions.index': { paramsTuple?: []; params?: {} }
    'inscriptions.store': { paramsTuple?: []; params?: {} }
    'inscriptions.export': { paramsTuple?: []; params?: {} }
    'configs.index': { paramsTuple?: []; params?: {} }
    'configs.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'teams.index': { paramsTuple?: []; params?: {} }
    'inscriptions.index': { paramsTuple?: []; params?: {} }
    'inscriptions.export': { paramsTuple?: []; params?: {} }
    'configs.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'teams.index': { paramsTuple?: []; params?: {} }
    'inscriptions.index': { paramsTuple?: []; params?: {} }
    'inscriptions.export': { paramsTuple?: []; params?: {} }
    'configs.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'teams.store': { paramsTuple?: []; params?: {} }
    'teams.increment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teams.decrement': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inscriptions.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'teams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'configs.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'teams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}