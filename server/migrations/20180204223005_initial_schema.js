// initial_schema.js

exports.up = knex => knex.schema.createTable('issues', tb => {
  tb.integer('id').primary()
  tb.integer('number')
  tb.string('title', 30)
}).createTable('users', tb => {
  tb.increments('id_user')
  tb.string('name')
  tb.string('avatar')
}).createTable('comments', tb => {
  tb.increments('id_comment')
  tb.integer('id_issue').notNullable()
    .references('issues.id').onDelete('cascade')
  tb.integer('id_user').notNullable()
    .references('user.id_user').onDelete('cascade')
  tb.string('comment')
})

exports.down = knex => knex.schema
  .dropTable('issues')
  .dropTable('users')
  .dropTable('comments')