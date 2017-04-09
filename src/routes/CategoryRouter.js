import { Router }  from 'express';

import CategoryService from '../services/CategoryService';

export default class CategoryRouter {

  constructor(path = '/api/categories') {
    this.router = Router();
    this.path = path;
    this.categoryService = new CategoryService();
    this.init();
  }

  async getAll(req, res) {
    try {
      const categories = await this.categoryService.all();
      res.status(200).json(categories);
    } catch(error) {
      res.status(500).send(error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.get(id);
      res.status(200).json(category);
    } catch(error) {
      if (error.message === 'Not found') res.status(404).send('Category not found');
      res.status(500).send(error.stack);
    }
  }

  async store(req, res) {
    try {
      const data = req.body;
      const category = await this.categoryService.create(data);
      res.status(201).json(category);
    } catch(error) {
      res.status(500).send(error);
    }
  }

  updateById(req, res) {

  }


  removeById(req, res) {

  }

  /**
   * Attach route handlers to their endpoints.
   */
  init() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.store.bind(this));
    // this.router.put('/:id', this.updateOneById.bind(this));
    // this.router.delete('/:id', this.removeById.bind(this));
  }

}
