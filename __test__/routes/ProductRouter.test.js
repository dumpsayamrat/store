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
          name: 'Food',
          description: 'Food Stuff'
        }).then((category) => {
          return productService.create(
            category.id,
            'Banana',
            'Banana to you',
            10,
            8
          ).then(() => {
            return productService.create(
              category.id,
              'Apple',
              'Apple to you',
              20,
              18
            );
          });
        });
      }).catch((error) => {
        console.error('Clear the table category: FAIL');
      });
    }).catch((error) => {
      console.error('Clear the table product: FAIL');
    });
  });

  describe('GET /api/products - get all products', () => {
    // properties expected on an obj in the response
    let expectedProps = ['id', 'category_id', 'name', 'description', 'price', 'quantity'];
    test('should return JSON array', () => {
      return request(app).get('/api/products')
        .expect(200)
        .then(res => {
          // check that it sends back an array
          const products = res.body;
          expect(products).toBeInstanceOf(Array);
        });
    });
    test('should return objs w/ correct props', () => {
      return request(app).get('/api/products')
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
      return request(app).get('/api/products')
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

  describe('GET /api/products/category/:id - get all products in category', () => {
    test('should return JSON array', async () => {
      const categories = await categoryService.all();
      const id = categories[0].id;
      const res = await request(app).get(`/api/products/category/${id}`).expect(200);
      const foodProducts = res.body;
      expect(foodProducts).toBeInstanceOf(Array);
      expect(foodProducts.length).toBe(2);
      expect(foodProducts[0].name).toEqual('Banana');
      expect(foodProducts[1].name).toEqual('Apple');
    });
  });

  describe('GET /api/products/:id - get product item by id', () => {
    test('should return an obj of type Product', async () => {
      const products = await productService.all();
      const id = products[1].id;
      const res = await request(app).get(`/api/products/${id}`).expect(200);
      const reqKeys = ['id', 'category_id', 'name', 'description', 'price', 'quantity'];
      const item = res.body;
      // check it has correct keys
      reqKeys.forEach((key) => {
        expect(Object.keys(item)).toContain(key);
      });
      // check type of each field
      expect(typeof item.id).toBe('number');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.description).toBe('string');
      expect(typeof item.price).toBe('string');
      expect(typeof item.quantity).toBe('string');
    });
    test('should return a Product w/ requested id', async () => {
      const categories = await categoryService.all();
      const categoryId = categories[0].id;
      const products = await productService.all();
      const id = products[1].id;
      const res = await request(app).get(`/api/products/${id}`).expect(200);
      expect(res.body).toEqual({
        id,
        category_id: categoryId,
        name: 'Apple',
        description: 'Apple to you',
        price: '$20.00',
        quantity: '18'
      });
    });
    test('should 400 on a request for a nonexistant id', async () => {
      const res1 = await request(app).get('/api/products/-21').expect(400);
      const res2 = await request(app).get('/api/products/99999').expect(400);
      expect(res1.text).toEqual('Product not found');
      expect(res2.text).toEqual('Product not found');
    });
  });

  describe('POST /api/products - create new product', () => {
    let pizza = {
      name: 'Pizza',
      description: 'Pizza to you',
      price: 70,
      quantity: 55
    };
    test('should accept and add a valid new item', async () => {
      const categories = await categoryService.all();
      const categoryId = categories[0].id;
      pizza.categoryId = categoryId;
      const res = await request(app).post('/api/products').send(pizza).expect(201);
      const product = res.body;
      expect(product.category_id).toBe(pizza.categoryId);
      expect(product.name).toBe(pizza.name);
      expect(product.description).toBe(pizza.description);
      expect(product.price).toBe(`$${pizza.price}.00`);
      expect(product.quantity).toEqual(pizza.quantity+'');
      const res2 = await request(app).get('/api/products');
      expect(res2.body.length).toBe(3);
    });
  });

  describe('PUT /api/products/:id - update a product', () => {
    test('should accept and update a product ', async () => {
      const products = await productService.all();
      const id = products[1].id;
      const res = await request(app).put(`/api/products/${id}`)
        .send({ 
          name: 'Apple 2',
          description: 'Apple to me',
          quantity: 10
        })
        .expect(200);
      const product = res.body;
      expect(product.name).toBe('Apple 2');
      expect(product.description).toBe('Apple to me');
      expect(product.price).toBe('$20.00');
      expect(product.quantity).toBe('10');
    });
    test('should return error if given invalid ID', async () => {
      const res = await request(app).put('/api/products/-32')
        .send({ name: 'Apple with invalid id' })
        .expect(400);
      expect(res.text.includes('not found')).toBe(true);
    });
  });
  
  describe('DELETE /api/products/:id - delete an item', () => {
    test('should accept and delete a category', async () => {
      const products = await productService.all();
      const id = products[1].id;
      const res = await request(app).delete(`/api/products/${id}`)
        .expect(200);
      const newProducts = await productService.all();
      expect(res.body).toEqual(products[1]); 
      expect(newProducts.length).toEqual(products.length - 1);
    });
    test('should return error if given invalid ID', async () => {
      const res = await request(app).delete('/api/products/99999')
        .expect(400);
      expect(res.text.includes('not found')).toBe(true);
    });
  });
});
