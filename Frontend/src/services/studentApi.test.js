import api from './api';
import * as studentApi from './studentApi';

jest.mock('./api');

describe('Student API Service', () => {
  const mockApi = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.mockImplementation(() => mockApi);
  });

  describe('fetchMyPlacement', () => {
    test('calls api.get with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      studentApiModule.fetchMyPlacement();
      
      expect(mockApi.get).toHaveBeenCalledWith('/students/placements/');
    });
  });

  describe('fetchMyLogs', () => {
    test('calls api.get with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      studentApiModule.fetchMyLogs();
      
      expect(mockApi.get).toHaveBeenCalledWith('/evaluations/logs/');
    });
  });

  describe('createLog', () => {
    test('calls api.post with correct endpoint and data', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      const testData = { week_number: 5, content: 'Test log content' };
      studentApiModule.createLog(testData);
      
      expect(mockApi.post).toHaveBeenCalledWith('/evaluations/logs/', testData);
    });
  });

  describe('updateLog', () => {
    test('calls api.patch with correct endpoint and data', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      const testId = 1;
      const testData = { week_number: 6, content: 'Updated log content' };
      studentApiModule.updateLog(testId, testData);
      
      expect(mockApi.patch).toHaveBeenCalledWith(/evaluations/logs//, testData);
    });
  });

  describe('deleteLog', () => {
    test('calls api.delete with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      const testId = 1;
      studentApiModule.deleteLog(testId);
      
      expect(mockApi.delete).toHaveBeenCalledWith(/evaluations/logs//);
    });
  });

  describe('submitLog', () => {
    test('calls api.patch with correct endpoint and data', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      const testId = 1;
      studentApiModule.submitLog(testId);
      
      expect(mockApi.patch).toHaveBeenCalledWith(/evaluations/logs//update_status/, { status: 'submitted' });
    });
  });

  describe('fetchMyNotifications', () => {
    test('calls api.get with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      studentApiModule.fetchMyNotifications();
      
      expect(mockApi.get).toHaveBeenCalledWith('/students/notifications/');
    });
  });

  describe('markNotificationRead', () => {
    test('calls api.patch with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      const testId = 1;
      studentApiModule.markNotificationRead(testId);
      
      expect(mockApi.patch).toHaveBeenCalledWith(/students/notifications//read/);
    });
  });

  describe('markAllNotificationsRead', () => {
    test('calls api.post with correct endpoint', () => {
      // Re-import the module to get the mocked api
      jest.resetModules();
      const studentApiModule = require('./studentApi');
      
      studentApiModule.markAllNotificationsRead();
      
      expect(mockApi.post).toHaveBeenCalledWith('/students/notifications/mark-all-read/');
    });
  });
});
