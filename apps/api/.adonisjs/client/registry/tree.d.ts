/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  teams: {
    index: typeof routes['teams.index']
    store: typeof routes['teams.store']
    update: typeof routes['teams.update']
    destroy: typeof routes['teams.destroy']
    increment: typeof routes['teams.increment']
    decrement: typeof routes['teams.decrement']
  }
  inscriptions: {
    index: typeof routes['inscriptions.index']
    store: typeof routes['inscriptions.store']
    export: typeof routes['inscriptions.export']
  }
  configs: {
    index: typeof routes['configs.index']
    update: typeof routes['configs.update']
  }
}
