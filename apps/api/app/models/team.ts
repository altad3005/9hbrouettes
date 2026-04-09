import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Inscription from '#models/inscription'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nom: string

  @column()
  declare tours: number

  @hasMany(() => Inscription)
  declare inscriptions: HasMany<typeof Inscription>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}