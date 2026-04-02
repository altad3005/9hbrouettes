/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'teams.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/teams'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['index']>>>
    }
  }
  'teams.store': {
    methods: ["POST"]
    pattern: '/api/teams'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['store']>>>
    }
  }
  'teams.update': {
    methods: ["PUT"]
    pattern: '/api/teams/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['update']>>>
    }
  }
  'teams.destroy': {
    methods: ["DELETE"]
    pattern: '/api/teams/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['destroy']>>>
    }
  }
  'teams.increment': {
    methods: ["POST"]
    pattern: '/api/teams/:id/increment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['increment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['increment']>>>
    }
  }
  'teams.decrement': {
    methods: ["POST"]
    pattern: '/api/teams/:id/decrement'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['decrement']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teams_controller').default['decrement']>>>
    }
  }
  'inscriptions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/inscriptions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['index']>>>
    }
  }
  'inscriptions.store': {
    methods: ["POST"]
    pattern: '/api/inscriptions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['store']>>>
    }
  }
  'inscriptions.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/inscriptions/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inscriptions_controller').default['export']>>>
    }
  }
  'configs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/config'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/configs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/configs_controller').default['index']>>>
    }
  }
  'configs.update': {
    methods: ["PUT"]
    pattern: '/api/config'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/configs_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/configs_controller').default['update']>>>
    }
  }
}
