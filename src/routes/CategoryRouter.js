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
      if (error.message === 'Category not found') res.status(400).send('Category not found');
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

  async updateById(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.get(id);
      const {
        name = category.name,
        description = category.description
      } = req.body;
      const updatedCategory = await this.categoryService.update({ id, name, description});
      res.status(200).json(updatedCategory);
    } catch(error) {
      if (error.message === 'Category not found') res.status(400).send('Category not found');
      res.status(500).send(error.stack);
    }
  }


  async removeById(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.get(id);
      const deletedCategory = await this.categoryService.delete(category.id);
      res.status(200).json(deletedCategory);
    } catch(error) {
      if (error.message === 'Category not found') res.status(400).send('Category not found');
      res.status(500).send(error.stack);
    }
  }

  /**
   * Attach route handlers to their endpoints.
   */
  init() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.store.bind(this));
    this.router.put('/:id', this.updateById.bind(this));
    this.router.delete('/:id', this.removeById.bind(this));
  }
}
