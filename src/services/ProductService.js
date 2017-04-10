import { query } from '../database';

export default class ProductService {
  all() {
    const queryText = `
      SELECT id, category_id, name, description, price, quantity
      FROM product
    `;
    return new Promise((resolve, reject) => {
      query(queryText, [], function(err, res) {
        if(err) reject(err);
        resolve(res.rows);
      });
    });
  }
  get(id) {
    const queryText = `
      SELECT id, category_id, name, description, price, quantity
      FROM product
      WHERE id = $1
    `;
    return new Promise((resolve, reject) => {
      query(queryText, [id], function(err, res) {
        if (err) reject(err);
        if (res.rowCount === 0) reject(new Error('Product not found'));
        resolve(res.rows[0]);
      });
    });
  }
  getByCategoryId(categoeyId) {
    const queryText = `
      SELECT id, category_id, name, description, price, quantity
      FROM product
      WHERE category_id = $1
    `;
    return new Promise((resolve, reject) => {
      query(queryText, [categoeyId], function(err, res) {
        if(err) reject(err);
        resolve(res.rows);
      });
    });
  }
  create(...params) {
    const queryText = `
      INSERT INTO product (category_id, name, description, created_at, updated_at, price, quantity) 
      VALUES ($1, $2, $3, NOW(), NOW(), $4, $5) 
      RETURNING id, category_id, name, description, price, quantity
    `;
    return new Promise((resolve, reject) => {
      query(queryText, params, function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert product error');
        resolve(res.rows[0]);
      });
    });
  }
  update(...params) {
    const queryText = `
      UPDATE product
      SET
        category_id = $2,
        name = $3,
        description = $4,
        price = $5,
        quantity = $6,
        updated_at = NOW()
      WHERE
        id = $1
      RETURNING id, category_id, name, description, price, quantity
    `;
    return new Promise((resolve, reject) => {
      query(queryText, params, function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert product error');
        resolve(res.rows[0]);
      });
    });
  }
  delete(id) {
    const queryText = `
      DELETE FROM product 
      WHERE id = $1  
      RETURNING id, category_id, name, description, price, quantity
    `;
    return new Promise((resolve, reject) => {
      query(queryText, [id], function(err, res) {
        if (err) reject(err);
        if (res.rowCount < 1) reject('Insert category error');
        resolve(res.rows[0]);
      });
    });
  }
  empty() {
    return new Promise((resolve, reject) => {
      query('DElETE FROM product', [], function(err, res) {
        if (err) reject(err);
        resolve('SUCCESS');
      });
    });
  }
}
