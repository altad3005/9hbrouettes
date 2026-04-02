import { WebSocketServer, WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { Server } from 'node:http'

export class WsService {
  private static wss: WebSocketServer
  private static clients: Set<WebSocket> = new Set()

  static boot(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' })

    this.wss.on('connection', async (ws: WebSocket, _req: IncomingMessage) => {
      this.clients.add(ws)

      // Envoie l'état initial au client qui se connecte
      const { default: Team } = await import('#models/team')
      const { default: Config } = await import('#models/config')

      const teams = await Team.all()
      const configRows = await Config.all()
      const config = Object.fromEntries(configRows.map((c) => [c.key, c.value]))

      ws.send(JSON.stringify({ type: 'teams', data: teams }))
      ws.send(JSON.stringify({ type: 'config', data: config }))

      ws.on('close', () => this.clients.delete(ws))
      ws.on('error', () => this.clients.delete(ws))
    })
  }

  static broadcast(message: { type: string; data: unknown }) {
    const payload = JSON.stringify(message)
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload)
      }
    }
  }
}