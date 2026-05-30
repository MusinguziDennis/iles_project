import axios from 'axios';
import api from './api';

jest.mock('axios');

describe('API Service', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: {
      headers: {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  test('creates axios instance with correct base URL', () => {
    // Re-import the module to get the mocked axios
    jest.resetModules();
    const apiModule = require('./api').default;
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8000/api',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  test('sets up request interceptor', () => {
    // Re-import the module to get the mocked axios
    jest.resetModules();
    require('./api');
    
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  test('sets up response interceptor', () => {
    // Re-import the module to get the mocked axios
    jest.resetModules();
    require('./api');
    
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  test('request interceptor adds authorization token when present', () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        clear: jest.fn(() => { store = {}; }),
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Set token in localStorage
    localStorageMock.getItem.mockReturnValue('test-token');
    
    // Re-import the module
    jest.resetModules();
    require('./api');
    
    // Get the interceptor function
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    
    // Test with config
    const config = { headers: {} };
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  test('request interceptor does not add authorization token when not present', () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock localStorage to return null
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        clear: jest.fn(),
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Re-import the module
    jest.resetModules();
    require('./api');
    
    // Get the interceptor function
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    
    // Test with config
    const config = { headers: {} };
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });
});
