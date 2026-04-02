import type { HttpContext } from '@adonisjs/core/http'
import Team from '#models/team'
import { WsService } from '#services/ws_service'

export default class TeamsController {
  async index({ response }: HttpContext) {
    const teams = await Team.all()
    return response.ok(teams)
  }

  async store({ request, response }: HttpContext) {
    const { id, nom } = request.body()
    const team = await Team.create({ id, nom, tours: 0 })
    WsService.broadcast({ type: 'teams', data: await Team.all() })
    return response.created(team)
  }

  async update({ params, request, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    const { tours } = request.body()
    team.tours = tours
    await team.save()
    WsService.broadcast({ type: 'teams', data: await Team.all() })
    return response.ok(team)
  }

  async destroy({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    await team.delete()
    WsService.broadcast({ type: 'teams', data: await Team.all() })
    return response.noContent()
  }

  async increment({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    team.tours += 1
    await team.save()
    WsService.broadcast({ type: 'teams', data: await Team.all() })
    return response.ok({ nom: team.nom, tours: team.tours })
  }

  async decrement({ params, response }: HttpContext) {
    const team = await Team.findOrFail(params.id)
    if (team.tours <= 0) return response.badRequest({ error: 'Déjà à 0' })
    team.tours -= 1
    await team.save()
    WsService.broadcast({ type: 'teams', data: await Team.all() })
    return response.ok({ nom: team.nom, tours: team.tours })
  }
}