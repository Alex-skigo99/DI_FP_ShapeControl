// run once after upload project to create database tables -> node build/config/init_db.js

import { db } from './db.js';

db.schema.withSchema('public')
.createTable('strava', table => {
  table.increments('id').primary();
  table.string('client_id', 30).notNullable().unique();
  table.string('secret', 500);
  table.string('token', 500);
  table.string('refresh_token', 500);
})
.then(() => console.log('Table strava created.'))
.catch(err => console.error(err));

db.schema.withSchema('public')
.createTable('users', table => {
  table.increments('id').primary();
  table.string('username', 30).notNullable().unique();
  table.string('password', 100);
  table.string('token', 500);
  table.string('refresh_token', 500);
  table.string('email', 50);
  table.string('gender', 10).notNullable();
  table.integer('age').notNullable();
  table.integer('height').notNullable();
  table.integer('strava_id').unsigned().references('id').inTable('strava').onDelete('CASCADE');
})
.then(() => console.log('Table users created.'))
.catch(err => console.error(err));

// db.schema.withSchema('public')
// .createTable('programs', table => {
//   table.increments('id').primary();
//   table.string('progname', 100).notNullable();
//   table.string('level', 20).notNullable();
//   table.float('in_weight');
//   table.float('out_weight');
//   table.boolean('is_close');
//   table.string('progcomment', 300);
//   table.string('advice', 300);
//   table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
// })
// .then(() => console.log('Table programs created.'))
// .catch(err => console.error(err));

// db.schema.withSchema('public')
// .createTable('data', table => {
//   table.increments('id').primary();
//   table.string('day', 10).notNullable();
//   table.integer('plan');
//   table.integer('fact');
//   table.boolean('is_training');
//   table.string('comment', 200);
//   table.integer('prog_id').unsigned().references('id').inTable('programs').onDelete('CASCADE');
// })
// .then(() => console.log('Table data created.'))
// .catch(err => console.error(err));
