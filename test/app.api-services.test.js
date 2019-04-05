const request = require('supertest');
const app = require('../src/app');

jest.mock('api-services');
jest.mock('dotenv');
const mockApiServices = require('api-services');

describe('Test Api Services', () => {
  test('It should call goodreads service search method and fetch books', done => {
    mockApiServices.mockGoodreadsServiceSearch.mockImplementationOnce(() =>
      Promise.resolve([{ id: '2' }, { id: '1' }]),
    );
    request(app)
      .get('/search-book?title=%22ender%22&from=1&to=3')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].id).toEqual('2');
        expect(response.body[1].id).toEqual('1');
        const args =
          mockApiServices.mockGoodreadsServiceSearch.mock.calls[0][0];
        expect(args[0]).toEqual('"ender"');
        expect(args[1]).toEqual('1');
        expect(args[2]).toEqual('3');
        done();
      });
  });
  test('It should call omdb service search method and fetch movies', done => {
    mockApiServices.mockOmdbServiceSearch.mockImplementationOnce(() =>
      Promise.resolve([{ id: '2' }, { id: '1' }]),
    );
    request(app)
      .get('/search-movie?title=%22ender%22&from=1&to=3')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].id).toEqual('2');
        expect(response.body[1].id).toEqual('1');
        const args = mockApiServices.mockOmdbServiceSearch.mock.calls[0][0];
        expect(args[0]).toEqual('"ender"');
        expect(args[1]).toEqual('1');
        expect(args[2]).toEqual('3');
        done();
      });
  });
  test('It should call omdb service getMovie method and fetch movie info', done => {
    mockApiServices.mockOmdbServiceGetMovieInfo.mockImplementationOnce(() =>
      Promise.resolve({ id: '1', name: 'Star Wars' }),
    );
    request(app)
      .get('/get-movie?id=1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toEqual('1');
        expect(response.body.name).toEqual('Star Wars');
        const args =
          mockApiServices.mockOmdbServiceGetMovieInfo.mock.calls[0][0];
        expect(args[0]).toEqual('1');
        done();
      });
  });
});
