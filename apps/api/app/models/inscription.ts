import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Team from '#models/team'

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
  declare teamId: string | null

  @belongsTo(() => Team)
  declare team: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}