const mockGoodreadsServiceSearch = jest.fn(() => Promise.resolve([]));
const mockOmdbServiceSearch = jest.fn(() => Promise.resolve([]));
const mockOmdbServiceGetMovieInfo = jest.fn(() => Promise.resolve([]));

class GoodreadsServiceMock {
  search(...args) {
    return mockGoodreadsServiceSearch(args);
  }
}

class OmbdServiceMock {
  search(...args) {
    return mockOmdbServiceSearch(args);
  }
  getMovieInfo(...args) {
    return mockOmdbServiceGetMovieInfo(args);
  }
}

module.exports = {
  GoodreadsService: GoodreadsServiceMock,
  OmbdService: OmbdServiceMock,
  mockGoodreadsServiceSearch,
  mockOmdbServiceSearch,
  mockOmdbServiceGetMovieInfo,
};
