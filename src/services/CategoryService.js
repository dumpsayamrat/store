import { query } from '../database';

export default class CategoryService {
  all() {
    return new Promise((resolve, reject) => {
      query('SELECT id, name, description FROM category', [], function(err, res) {
        if(err) reject(err);
        resolve(res.rows);
      });
    });
  }
  get(id) {
    return new Promise((resolve, reject) => {
      query('SELECT id, name, description FROM category WHERE id = $1', [id], function(err, res) {
        if (err) reject(err);
        if (res.rowCount === 0) reject(new Error('Not found'));
        resolve(res.rows[0]);
      });
    });
  }
  create({ name, description }) {
    return new Promise((resolve, reject) => {
      query('INSERT INTO category (name, description) VALUES ($1, $2) RETURNING id, name, description', [name, description], function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert category error');
        resolve(res.rows[0]);
      });
    });
  }
  update({ id, name, description }) {
    const queryText = `
      UPDATE category
      SET
        name = $1,
        description = $2
      WHERE
        id = $3
      RETURNING id, name, description
    `;
   return new Promise((resolve, reject) => {
      query(queryText, [name, description, id], function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert category error');
        resolve(res.rows[0]);
      });
    });
  }
  delete(id) {
   return new Promise((resolve, reject) => {
      query('DELETE FROM category WHERE id = $1  RETURNING id, name, description', [id], function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert category error');
        resolve(res.rows[0]);
      });
    });
  }
  empty() {
    return new Promise((resolve, reject) => {
      query('DElETE FROM category', [], function(err, res) {
        if (err) reject(err);
        resolve('SUCCESS');
      });
    });
  }
}
