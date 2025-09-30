import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactUs from '../../src/app/[lang]/(site)/contact-us/page';
import { TestProviders } from '../utils/TestWrapper';

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock environment variable
process.env.NEXT_PUBLIC_EMAIL_API = 'https://test-api.com';

// Helper function to render ContactUs with all providers
const renderContactUs = () => {
  return render(
    <TestProviders>
      <ContactUs />
    </TestProviders>,
  );
};

// Helper function to fill out the form
const fillOutForm = async (
  user: any,
  name = 'John Doe',
  email = 'john@example.com',
  message = 'Test message',
) => {
  await user.type(screen.getByLabelText(/name/i), name);
  await user.type(screen.getByLabelText(/email/i), email);
  await user.type(screen.getByLabelText(/message/i), message);
};

// Helper function to submit the form
const submitForm = async (user: any) => {
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);
};

// Helper function to get form elements
const getFormElements = () => ({
  nameInput: screen.getByLabelText(/name/i),
  emailInput: screen.getByLabelText(/email/i),
  messageInput: screen.getByLabelText(/message/i),
  submitButton: screen.getByRole('button', { name: /submit/i }),
});

// Expected API call payload
const getExpectedApiCall = (name: string, email: string, message: string) => ({
  url: 'https://test-api.com/email/send',
  options: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
    }),
  },
});

describe('ContactUs', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('Renders the contact form correctly', () => {
    renderContactUs();

    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();

    const { nameInput, emailInput, messageInput, submitButton } = getFormElements();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('Allows user to fill out the form', async () => {
    const user = userEvent.setup();
    renderContactUs();

    await fillOutForm(user);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
  });

  test('Shows loading state when submitting', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderContactUs();
    await fillOutForm(user);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await submitForm(user);

    // Check loading state
expect(
  screen.getByRole('button', { name: /submit/i })
).toBeDisabled();



    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Inputs should be disabled
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
  });

  test('Makes correct API call on form submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderContactUs();
    await fillOutForm(user);
    await submitForm(user);

    const expected = getExpectedApiCall('John Doe', 'john@example.com', 'Test message');
    expect(mockFetch).toHaveBeenCalledWith(expected.url, expected.options);
  });

  test('Shows success message and clears form on successful submission', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderContactUs();
    await fillOutForm(user);
    await submitForm(user);

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });

    // Form is cleared
    const { nameInput, emailInput, messageInput } = getFormElements();
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  test('Shows error message on API failure', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderContactUs();
    await fillOutForm(user);
    await submitForm(user);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });

    // Form is not cleared
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
  });

  test('Shows error message on network error', async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderContactUs();
    await fillOutForm(user);
    await submitForm(user);

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  test('Requires all fields to be filled', async () => {
    const user = userEvent.setup();
    renderContactUs();

    await submitForm(user);

    // API call should not be made
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
