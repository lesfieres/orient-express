const dotenv = jest.genMockFromModule('dotenv');
dotenv.config.mockImplementation(() => ({
  parsed: {},
}));
module.exports = dotenv;
