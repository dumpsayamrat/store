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
        if (!res.rows.length) reject(new Error('Not found'));
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
  empty() {
    return new Promise((resolve, reject) => {
      query('DElETE FROM category', [], function(err, res) {
        if (err) reject(err);
        resolve('SUCCESS');
      });
    });
  }
}
