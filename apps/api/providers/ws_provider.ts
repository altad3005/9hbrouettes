import type { ApplicationService } from '@adonisjs/core/types'
import { WsService } from '#services/ws_service'

export default class WsProvider {
  constructor(protected app: ApplicationService) {}

  register() {}
  async boot() {}
  async start() {}

  async ready() {
    const server = await this.app.container.make('server')
    const nodeServer = server.getNodeServer()
    if (!nodeServer) throw new Error('HTTP server not available')
    WsService.boot(nodeServer)
  }

  async shutdown() {}
}