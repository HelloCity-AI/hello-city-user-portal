import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactUs from '@/components/ContactUs';

describe('ContactUs', () => {
  test('Renders form fields and submit button', () => {
    render(<ContactUs />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('Can type into fields', () => {
    render(<ContactUs />);
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Mario' } });
    expect(nameInput).toHaveValue('Mario');
  });

test('Shows required error when message input is empty in ContactUs form', () => {
  render(<ContactUs />);
  const messageInput = screen.getByLabelText(/message/i);

  
  fireEvent.change(messageInput, { target: { value: 'Hello' } });
  fireEvent.change(messageInput, { target: { value: '' } });

  expect(screen.getByText('Message is required.')).toBeInTheDocument();
});


});
