import type { HttpContext } from '@adonisjs/core/http'
import Config from '#models/config'
import { WsService } from '#services/ws_service'

export default class ConfigsController {
  async update({ request, response }: HttpContext) {
    const body = request.body()
    const allowed = ['endTime', 'startTime']
    await Promise.all(
      allowed
        .filter((key) => key in body)
        .map((key) => Config.updateOrCreate({ key }, { value: body[key] }))
    )
    const config = await Config.all()
    const configObj = Object.fromEntries(config.map((c) => [c.key, c.value]))
    WsService.broadcast({ type: 'config', data: configObj })
    return response.ok(configObj)
  }

  async index({ response }: HttpContext) {
    const config = await Config.all()
    const configObj = Object.fromEntries(config.map((c) => [c.key, c.value]))
    return response.ok(configObj)
  }
}