// Mock for @auth0/nextjs-auth0/server
class MockAuth0Client {
  constructor(options) {
    this.options = options;
  }

  async getAccessToken() {
    return { token: 'mock-access-token' };
  }

  async getSession() {
    return { user: { sub: 'mock-user-id' } };
  }
}

const mockExports = {
  Auth0Client: MockAuth0Client,
};

// Support both CommonJS and ES modules
module.exports = mockExports;
module.exports.default = mockExports;
module.exports.Auth0Client = MockAuth0Client;
