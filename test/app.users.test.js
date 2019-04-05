const request = require('supertest');

jest.mock('fs');
jest.mock('dotenv');
const mockFs = require('fs');

const app = require('../src/app.js');
// require refers to the same instance here and inside app,
// whatever method we call here from usersService (initialize)
// will effect the userService inside the app
const usersService = require('../src/users.js');

describe.only('Test User management', () => {
  test('It should register a user', done => {
    mockFs.writeFile.mockImplementation((file, content, callback) => {
      callback();
    });
    request(app)
      .post('/register')
      .send({
        username: 'test-username',
        password: 'test-password',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  test('It should login a user loaded from disk', done => {
    mockFs.readFileSync.mockImplementationOnce(() =>
      JSON.stringify({
        test: {
          username: 'test',
          password: '098f6bcd4621d373cade4e832627b4f6',
        },
      }),
    );
    usersService.initialize();
    request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'test',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        done();
      });
  });

  test(`It should login a user after it's registered`, done => {
    mockFs.readFileSync.mockImplementationOnce(() => JSON.stringify({}));
    usersService.initialize();
    mockFs.writeFile.mockImplementation((file, content, callback) => {
      callback();
    });
    request(app)
      .post('/register')
      .send({
        username: 'test',
        password: 'test',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        request(app)
          .post('/login')
          .send({
            username: 'test',
            password: 'test',
          })
          .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
            done();
          });
      });
  });

  test('It should logout with a token after logging in', done => {
    mockFs.readFileSync.mockImplementationOnce(() =>
      JSON.stringify({
        test: {
          username: 'test',
          password: '098f6bcd4621d373cade4e832627b4f6',
        },
      }),
    );
    usersService.initialize();
    request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'test',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        const header = { Authorization: `Bearer ${token}` };
        request(app)
          .get('/logout')
          .set(header)
          .then(response => {
            expect(response.statusCode).toBe(200);
            done();
          });
      });
  });
});
