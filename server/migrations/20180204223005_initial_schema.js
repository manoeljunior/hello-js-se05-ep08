// initial_schema.js

exports.up = knex => knex.schema.createTable('issues', tb => {
  tb.integer('id_issue').primary()
  tb.string('description', 30)
}).createTable('users', tb => {
  tb.increments('id_user')
  tb.string('name')
  tb.string('avatar')
}).createTable('comments', tb => {
  tb.integer('id_issue').notNullable()
    .references('issues.id_issue').onDelete('cascade')
  tb.integer('id_user').notNullable()
    .references('user.id_user').onDelete('cascade')
  tb.primary(['id_issue', 'id_user'])
  tb.string('comment')
})

exports.down = knex => knex.schema
  .dropTable('issues')
  .dropTable('users')
  .dropTable('comments')