import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './login';

// Mock the context and hooks
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    getDashboardPath: (role) => /dashboard/,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { message: '' } }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);
    
    // Check if form elements are present
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('shows error message when login fails', async () => {
    // Mock login function to reject
    const { useAuth } = require('../../context/AuthContext');
    useAuth().login.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<Login />);
    
    const usernameInput = screen.getByPlaceholderText(/username or email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);
    
    // Wait for error message
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
  });

  test('calls login function on form submit', async () => {
    // Mock login function to resolve
    const mockUserData = { role: 'student', id: 1 };
    const { useAuth } = require('../../context/AuthContext');
    useAuth().login.mockResolvedValue(mockUserData);
    
    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigate,
      useLocation: () => ({ state: { message: '' } }),
    }));
    
    // Re-import the component to get the mocked hooks
    jest.resetModules();
    const LoginComponent = require('./login').default;
    
    render(<LoginComponent />);
    
    const usernameInput = screen.getByPlaceholderText(/username or email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    // Fill in form
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Wait for navigation
    expect(useAuth().login).toHaveBeenCalledWith('testuser', 'password123');
    expect(navigate).toHaveBeenCalledWith('/dashboard/student');
  });
});
