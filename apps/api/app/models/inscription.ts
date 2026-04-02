import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Inscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare prenom: string

  @column()
  declare nom: string

  @column()
  declare email: string

  @column()
  declare telephone: string | null

  @column.date()
  declare dateNaissance: DateTime | null

  @column()
  declare repas: 'normal' | 'vege'

  @column()
  declare equipe: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}