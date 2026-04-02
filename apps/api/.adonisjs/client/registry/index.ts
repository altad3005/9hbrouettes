/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'teams.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/teams',
    tokens: [{"old":"/api/teams","type":0,"val":"api","end":""},{"old":"/api/teams","type":0,"val":"teams","end":""}],
    types: placeholder as Registry['teams.index']['types'],
  },
  'teams.store': {
    methods: ["POST"],
    pattern: '/api/teams',
    tokens: [{"old":"/api/teams","type":0,"val":"api","end":""},{"old":"/api/teams","type":0,"val":"teams","end":""}],
    types: placeholder as Registry['teams.store']['types'],
  },
  'teams.update': {
    methods: ["PUT"],
    pattern: '/api/teams/:id',
    tokens: [{"old":"/api/teams/:id","type":0,"val":"api","end":""},{"old":"/api/teams/:id","type":0,"val":"teams","end":""},{"old":"/api/teams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teams.update']['types'],
  },
  'teams.destroy': {
    methods: ["DELETE"],
    pattern: '/api/teams/:id',
    tokens: [{"old":"/api/teams/:id","type":0,"val":"api","end":""},{"old":"/api/teams/:id","type":0,"val":"teams","end":""},{"old":"/api/teams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teams.destroy']['types'],
  },
  'teams.increment': {
    methods: ["POST"],
    pattern: '/api/teams/:id/increment',
    tokens: [{"old":"/api/teams/:id/increment","type":0,"val":"api","end":""},{"old":"/api/teams/:id/increment","type":0,"val":"teams","end":""},{"old":"/api/teams/:id/increment","type":1,"val":"id","end":""},{"old":"/api/teams/:id/increment","type":0,"val":"increment","end":""}],
    types: placeholder as Registry['teams.increment']['types'],
  },
  'teams.decrement': {
    methods: ["POST"],
    pattern: '/api/teams/:id/decrement',
    tokens: [{"old":"/api/teams/:id/decrement","type":0,"val":"api","end":""},{"old":"/api/teams/:id/decrement","type":0,"val":"teams","end":""},{"old":"/api/teams/:id/decrement","type":1,"val":"id","end":""},{"old":"/api/teams/:id/decrement","type":0,"val":"decrement","end":""}],
    types: placeholder as Registry['teams.decrement']['types'],
  },
  'inscriptions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/inscriptions',
    tokens: [{"old":"/api/inscriptions","type":0,"val":"api","end":""},{"old":"/api/inscriptions","type":0,"val":"inscriptions","end":""}],
    types: placeholder as Registry['inscriptions.index']['types'],
  },
  'inscriptions.store': {
    methods: ["POST"],
    pattern: '/api/inscriptions',
    tokens: [{"old":"/api/inscriptions","type":0,"val":"api","end":""},{"old":"/api/inscriptions","type":0,"val":"inscriptions","end":""}],
    types: placeholder as Registry['inscriptions.store']['types'],
  },
  'inscriptions.export': {
    methods: ["GET","HEAD"],
    pattern: '/api/inscriptions/export',
    tokens: [{"old":"/api/inscriptions/export","type":0,"val":"api","end":""},{"old":"/api/inscriptions/export","type":0,"val":"inscriptions","end":""},{"old":"/api/inscriptions/export","type":0,"val":"export","end":""}],
    types: placeholder as Registry['inscriptions.export']['types'],
  },
  'configs.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/config',
    tokens: [{"old":"/api/config","type":0,"val":"api","end":""},{"old":"/api/config","type":0,"val":"config","end":""}],
    types: placeholder as Registry['configs.index']['types'],
  },
  'configs.update': {
    methods: ["PUT"],
    pattern: '/api/config',
    tokens: [{"old":"/api/config","type":0,"val":"api","end":""},{"old":"/api/config","type":0,"val":"config","end":""}],
    types: placeholder as Registry['configs.update']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
