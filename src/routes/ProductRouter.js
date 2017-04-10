import { Router }  from 'express';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';

export default class CategoryRouter {

  constructor(path = '/api/products') {
    this.router = Router();
    this.path = path;
    this.categoryService = new CategoryService();
    this.productService = new ProductService();
    this.init();
  }

  async getAll(req, res) {
    try {
      const products = await this.productService.all();
      res.status(200).json(products);
    } catch(error) {
      res.status(500).send(error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.get(id);
      res.status(200).json(product);
    } catch(error) {
      if (error.message === 'Product not found') res.status(400).send('Product not found');
      res.status(500).send(error.stack);
    }
  }

  async getByCategoryId(req, res) {
    try {
      const { id } = req.params;
      const products = await this.productService.getByCategoryId(id);
      res.status(200).json(products);
    } catch(error) {
      res.status(500).send(error);
    }
  }

  async store(req, res) {
    try {
      const data = req.body;
      const product = await this.productService.create(
        data.categoryId,
        data.name,
        data.description,
        data.price,
        data.quantity
      );
      res.status(201).json(product);
    } catch(error) {
      res.status(500).send(error);
    }
  }

  async updateById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.get(id);
      const {
        categoryId = product.category_id,
        name = product.name,
        description = product.description,
        price = product.price,
        quantity = product.quantity
      } = req.body;
      const category = await this.categoryService.get(categoryId);
      const updatedProduct = await this.productService.update(
        product.id,
        category.id,
        name,
        description,
        price,
        quantity
      );
      res.status(200).json(updatedProduct);
    } catch(error) {
      if (error.message === 'Category not found') res.status(400).send('Category not found');
      if (error.message === 'Product not found') res.status(400).send('Product not found');
      res.status(500).send(error.stack);
    }
  }


  async removeById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.get(id);
      const deletedProduct = await this.productService.delete(product.id);
      res.status(200).json(deletedProduct);
    } catch(error) {
      if (error.message === 'Product not found') res.status(400).send('Category not found');
      res.status(500).send(error.stack);
    }
  }

  /**
   * Attach route handlers to their endpoints.
   */
  init() {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/category/:id', this.getByCategoryId.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.store.bind(this));
    this.router.put('/:id', this.updateById.bind(this));
    this.router.delete('/:id', this.removeById.bind(this));
  }

}
