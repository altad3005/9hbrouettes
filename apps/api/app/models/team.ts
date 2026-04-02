import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nom: string

  @column()
  declare tours: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}