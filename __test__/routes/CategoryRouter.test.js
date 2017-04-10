import request from 'supertest-as-promised';

import Api from '../../src/Api';
import CategoryService from '../../src/services/CategoryService';
import ProductService from '../../src/services/ProductService';

const app = new Api().express;

describe('Category API', () => {
  const categoryService = new CategoryService();
  const productService = new ProductService();
  beforeAll(() => {
    return productService.empty().then((message) => {
      if (message === 'SUCCESS') console.log('Clear the table product: SUCCESS');
      return categoryService.empty().then((message) => {
        if (message === 'SUCCESS') console.log('Clear the table category: SUCCESS');
        return categoryService.create({
          name: 'Test name 1',
          description: 'Test description 1'
        }).then(() => {
          return categoryService.create({
            name: 'Test name 2',
            description: 'Test description 2'
          });
        });
      }).catch((error) => {
        console.log(error);
        console.error('Clear the table category: FAIL');
      });
    }).catch((error) => {
      console.log(error);
      console.error('Clear the table product: FAIL');
    });
  });
  describe('GET /api/categories - get all categories', () => {
    // properties expected on an obj in the response
    let expectedProps = ['id', 'name', 'description'];
    test('should return JSON array', () => {
      return request(app).get('/api/categories')
        .expect(200)
        .then(res => {
          // check that it sends back an array
          expect(res.body).toBeInstanceOf(Array);
        });
    });
    test('should return objs w/ correct props', () => {
      return request(app).get('/api/categories')
        .expect(200)
        .then(res => {
          // check for the expected properties
          let sampleKeys = Object.keys(res.body[0]);
          expectedProps.forEach((key) => {
            expect(sampleKeys.includes(key)).toBe(true);
          });
        });
    });
    test('shouldn\'t return objs w/ extra props', () => {
      return request(app).get('/api/categories')
        .expect(200)
        .then(res => {
          // check for only expected properties
          let extraProps = Object.keys(res.body[0]).filter((key) => {
            return !expectedProps.includes(key);
          });
          expect(extraProps.length).toBe(0);
        });
    });
  });
  describe('GET /api/categories/:id - get categories item by id', () => {
    test('should return an obj of type Category', async () => {
      const categories = await categoryService.all();
      const id = categories[1].id;
      const res = await request(app).get(`/api/categories/${id}`).expect(200);
      const reqKeys = ['id', 'name', 'description'];
      const item = res.body;
      // check it has correct keys
      reqKeys.forEach((key) => {
        expect(Object.keys(item)).toContain(key);
      });
      // check type of each field
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.description).toBe('string');
    });
    test('should return a Category w/ requested id', async () => {
      const categories = await categoryService.all();
      const id = categories[1].id;
      const res = await request(app).get(`/api/categories/${id}`).expect(200);
      expect(res.body).toEqual({
        id,
        name: 'Test name 2',
        description: 'Test description 2'
      });
    });
    test('should 400 on a request for a nonexistant id', async () => {
      const res1 = await request(app).get('/api/categories/-21').expect(400);
      const res2 = await request(app).get('/api/categories/99999').expect(400);
      expect(res1.text).toEqual('Category not found');
      expect(res2.text).toEqual('Category not found');
    });
  });
  describe('POST /api/categories - create new item', () => {
    let book = {
      name: 'Book Goods',
      description: 'Book Things'
    };
    test('should accept and add a valid new item', () => {
      return request(app).post('/api/categories')
        .send(book)
        .expect(201)
        .then((res) => {
          const category = res.body;
          expect(category.name).toBe(book.name);
          expect(category.description).toBe(book.description);
          return request(app).get('/api/categories');
        })
        .then((res) => {
          expect(res.body.length).toBe(3);
        });
    });
  });
  describe('PUT /api/categories/:id - update an item', () => {
    test('should accept and update a category ', async () => {
      const categories = await categoryService.all();
      const id = categories[1].id;
      const res = await request(app).put(`/api/categories/${id}`)
        .send({ 
          name: 'Test name 2 Edited',
          description: 'Test description 2 Edited'
        })
        .expect(200);
      const category = res.body;
      expect(category.name).toBe('Test name 2 Edited');
      expect(category.description).toBe('Test description 2 Edited');
    });
    test('should return error if given invalid ID', async () => {
      const res = await request(app).put('/api/categories/-32')
        .send({ name: 'Test name -32 Edited' })
        .expect(400);
      expect(res.text).toEqual('Category not found');
    });
  });
  describe('DELETE /api/categories/:id - delete an item', () => {
    test('should accept and delete a category', async () => {
      const categories = await categoryService.all();
      const id = categories[1].id;
      const res = await request(app).delete(`/api/categories/${id}`)
        .expect(200);
      const newCategories = await categoryService.all();
      expect(res.body).toEqual(categories[1]);      
      expect(newCategories.length).toEqual(categories.length - 1);
    });
    test('should return error if given invalid ID', async () => {
      const res = await request(app).delete('/api/categories/99999')
        .expect(400);
      expect(res.text).toEqual('Category not found');
    });
  });
});
