import type { HttpContext } from '@adonisjs/core/http'
import Inscription from '#models/inscription'
import ExcelJS from 'exceljs'

export default class InscriptionsController {
  async store({ request, response }: HttpContext) {
    const { prenom, nom, email, telephone, dateNaissance, repas, teamId } = request.body()
    const inscription = await Inscription.create({ prenom, nom, email, telephone, dateNaissance, repas, teamId: teamId ?? null })
    return response.created(inscription)
  }

  async index({ response }: HttpContext) {
    const inscriptions = await Inscription.query().preload('team')
    return response.ok(inscriptions)
  }

  async export({ response }: HttpContext) {
    const inscriptions = await Inscription.query().preload('team')

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Inscriptions')

    sheet.columns = [
      { header: 'Prénom', key: 'prenom', width: 15 },
      { header: 'Nom', key: 'nom', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Téléphone', key: 'telephone', width: 15 },
      { header: 'Date de naissance', key: 'dateNaissance', width: 18 },
      { header: 'Repas', key: 'repas', width: 10 },
      { header: 'Équipe', key: 'equipe', width: 20 },
    ]

    inscriptions.forEach((i) => sheet.addRow({ ...i.toJSON(), equipe: i.team?.nom ?? null }))

    response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response.header('Content-Disposition', 'attachment; filename=inscriptions.xlsx')

    const buffer = await workbook.xlsx.writeBuffer()
    return response.send(buffer)
  }
}