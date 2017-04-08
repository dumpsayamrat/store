
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

export default class Api {

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
  }

  routes() {
     // this.express.use(produceRouter.path, produceRouter.router);
     this.express.get('/', (req, res) => {
       res.json({ message: 'Hello Store!!'});
     });
  }

}
