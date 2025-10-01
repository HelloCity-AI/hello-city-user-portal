// Mock for @auth0/nextjs-auth0/errors

class MockAccessTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessTokenError';
  }
}

const mockExports = {
  AccessTokenError: MockAccessTokenError,
};

// Support both CommonJS and ES modules
module.exports = mockExports;
module.exports.default = mockExports;
module.exports.AccessTokenError = MockAccessTokenError;
