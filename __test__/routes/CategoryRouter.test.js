import request from 'supertest-as-promised';
import Api from '../../src/api';
import CategoryService from '../../src/services/CategoryService';

const app = new Api().express;

describe('Category API', () => {
  const categoryService = new CategoryService();
  beforeAll(() => {
    categoryService.create({
      name: 'Test name 1',
      description: 'Test description 1'
    });
    categoryService.create({
      name: 'Test name 2',
      description: 'Test description 2'
    });
  });
  afterAll(() => {
    categoryService.empty().then((message) => {
      if (message === 'SUCCESS') console.log('Clear the table category: SUCCESS');
    }).catch((error) => {
      console.error('Clear the table category: FAIL');
    });
  });
  describe('GET /api/categories - get all categories', () => {
    // properties expected on an obj in the response
    let expectedProps = ['id', 'name', 'description'];
    it('should return JSON array', () => {
      return request(app).get('/api/categories')
      .expect(200)
      .then(res => {
        // check that it sends back an array
        expect(res.body).toBeInstanceOf(Array);
      });
    });
    it('should return objs w/ correct props', () => {
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
    it('shouldn\'t return objs w/ extra props', () => {
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
  describe('POST /api/categories - create new item', () => {
    let book = {
      name: 'Book Goods',
      description: 'Book Things'
    };
    it('should accept and add a valid new item', () => {
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
});
