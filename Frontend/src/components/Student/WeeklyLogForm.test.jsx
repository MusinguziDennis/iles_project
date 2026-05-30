import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeeklyLogForm from './WeeklyLogForm';

describe('WeeklyLogForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form for creating new log', () => {
    render(<WeeklyLogForm log={{}} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Check if form elements are present
    expect(screen.getByRole('heading', { name: /new weekly log/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/week number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly report content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create log/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('renders form for editing existing log', () => {
    const existingLog = { week_number: 5, content: 'This is a test log entry with sufficient content for validation.' };
    render(<WeeklyLogForm log={existingLog} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    // Check if form is pre-filled with existing data
    expect(screen.getByLabelText(/week number/i)).toHaveValue('5');
    expect(screen.getByLabelText(/weekly report content/i)).toHaveValue('This is a test log entry with sufficient content for validation.');
    expect(screen.getByRole('button', { name: /update log/i })).toBeInTheDocument();
  });

  test('validates week number', async () => {
    render(<WeeklyLogForm log={{}} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const weekNumberInput = screen.getByLabelText(/week number/i);
    const contentInput = screen.getByLabelText(/weekly report content/i);
    const submitButton = screen.getByRole('button', { name: /create log/i });
    
    // Fill in invalid week number (0) and valid content
    fireEvent.change(weekNumberInput, { target: { value: '0' } });
    fireEvent.change(contentInput, { target: { value: 'This is a test log entry with sufficient content for validation.' } });
    fireEvent.click(submitButton);
    
    // Should show validation error for week number
    expect(await screen.findByText(/week number must be between 1 and 52/i)).toBeInTheDocument();
    
    // Fill in valid week number
    fireEvent.change(weekNumberInput, { target: { value: '10' } });
    fireEvent.click(submitButton);
    
    // Should call onSuccess with correct data
    expect(mockOnSuccess).toHaveBeenCalledWith({ week_number: 10, content: 'This is a test log entry with sufficient content for validation.' });
  });

  test('validates content length', async () => {
    render(<WeeklyLogForm log={{}} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const weekNumberInput = screen.getByLabelText(/week number/i);
    const contentInput = screen.getByLabelText(/weekly report content/i);
    const submitButton = screen.getByRole('button', { name: /create log/i });
    
    // Fill in valid week number but too short content
    fireEvent.change(weekNumberInput, { target: { value: '5' } });
    fireEvent.change(contentInput, { target: { value: 'Too short' } }); // Less than 20 chars
    fireEvent.click(submitButton);
    
    // Should show validation error for content
    expect(await screen.findByText(/content must be at least 20 characters/i)).toBeInTheDocument();
    
    // Fill in valid content
    fireEvent.change(contentInput, { target: { value: 'This is a test log entry with sufficient content for validation.' } });
    fireEvent.click(submitButton);
    
    // Should call onSuccess with correct data
    expect(mockOnSuccess).toHaveBeenCalledWith({ week_number: 5, content: 'This is a test log entry with sufficient content for validation.' });
  });

  test('handles submit errors', async () => {
    // Mock onSuccess to reject
    const mockOnSuccessReject = jest.fn().mockRejectedValue(new Error('Network error'));
    render(<WeeklyLogForm log={{}} onClose={mockOnClose} onSuccess={mockOnSuccessReject} />);
    
    const weekNumberInput = screen.getByLabelText(/week number/i);
    const contentInput = screen.getByLabelText(/weekly report content/i);
    const submitButton = screen.getByRole('button', { name: /create log/i });
    
    // Fill in valid data
    fireEvent.change(weekNumberInput, { target: { value: '5' } });
    fireEvent.change(contentInput, { target: { value: 'This is a test log entry with sufficient content for validation.' } });
    fireEvent.click(submitButton);
    
    // Should show general error
    expect(await screen.findByText(/failed to save log/i)).toBeInTheDocument();
  });

  test('closes form when cancel button clicked', () => {
    render(<WeeklyLogForm log={{}} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
