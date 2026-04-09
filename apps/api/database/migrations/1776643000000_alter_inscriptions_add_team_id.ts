import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inscriptions'

  async up() {
    this.defer(async (db) => {
      await db.rawQuery('DELETE FROM inscriptions')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('equipe')
      table.string('team_id').nullable().references('id').inTable('teams').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['team_id'])
      table.dropColumn('team_id')
      table.string('equipe').nullable()
    })
  }
}
