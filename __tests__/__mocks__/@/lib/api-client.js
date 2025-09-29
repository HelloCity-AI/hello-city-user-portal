// Mock for api-client.ts
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const createApiClient = jest.fn(() => mockApiClient);

const fetchUserProfile = jest.fn().mockResolvedValue({
  data: {
    userId: '123',
    Email: 'test@example.com',
    FirstName: 'Test',
    LastName: 'User',
  },
  status: 200,
});

const createUserProfile = jest.fn().mockResolvedValue({
  data: { userId: '12345' },
  status: 201,
});

const updateUserProfile = jest.fn().mockResolvedValue({
  data: {
    userId: '123',
    Email: 'updated@example.com',
    FirstName: 'Updated',
    LastName: 'User',
  },
  status: 200,
});

const deleteUserProfile = jest.fn().mockResolvedValue({
  data: null,
  status: 204,
});

module.exports = {
  createApiClient,
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};

// ES module exports
module.exports.default = {
  createApiClient,
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
