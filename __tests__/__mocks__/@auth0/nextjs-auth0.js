// Mock for @auth0/nextjs-auth0
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
  getAccessToken: jest.fn(() => Promise.resolve({ accessToken: 'mock-access-token' })),
  getSession: jest.fn(() => Promise.resolve({ user: { sub: 'mock-user-id' } })),
  withApiAuthRequired: jest.fn((handler) => handler),
  withPageAuthRequired: jest.fn((component) => component),
  useUser: jest.fn(() => ({ user: { sub: 'mock-user-id' }, isLoading: false })),
  UserProvider: ({ children }) => children,
  handleAuth: jest.fn(),
  handleCallback: jest.fn(),
  handleLogin: jest.fn(),
  handleLogout: jest.fn(),
  handleProfile: jest.fn(),
};

// Support both CommonJS and ES modules
module.exports = mockExports;
module.exports.default = mockExports;
module.exports.Auth0Client = MockAuth0Client;
