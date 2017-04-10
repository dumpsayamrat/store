import pg from 'pg';

import config from '../../config';

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool
export const query = (text, values, callback) => {
  // console.log('query:', text, values);
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
export const connect = (callback) => {
  return pool.connect(callback);
};
