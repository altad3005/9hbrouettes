import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('prenom').notNullable()
      table.string('nom').notNullable()
      table.string('email').notNullable()
      table.string('telephone').nullable()
      table.date('date_naissance').nullable()
      table.enum('repas', ['normal', 'vege']).notNullable().defaultTo('normal')
      table.string('equipe').nullable()  // nom de l'équipe choisie/créée

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}