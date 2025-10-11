import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { messages } from '@/locales/en/messages.mjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CreateChecklistItemModal } from '@/compoundComponents/Modals/CreateChecklistItemModal';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// 设置 i18n
i18n.load('en', messages);
i18n.activate('en');

// Mock the DatePicker component to simplify testing
jest.mock('@/components/DatePicker', () => {
  return function MockDatePicker({
    label,
    value,
    onChange,
    disabled,
  }: {
    label: string;
    value?: Dayjs | null;
    onChange: (date: Dayjs) => void;
    disabled?: boolean;
  }) {
    return (
      <div>
        <label htmlFor="mock-date-picker">{label}</label>
        <input
          id="mock-date-picker"
          data-testid="date-picker-input"
          type="date"
          value={value ? value.format('YYYY-MM-DD') : ''}
          onChange={(e) => onChange(dayjs(e.target.value))}
          disabled={disabled}
        />
      </div>
    );
  };
});

// 创建测试用的主题
const theme = createTheme();

// 包装器组件，提供必要的上下文
const TestWrapper: React.FC<React.PropsWithChildren<object>> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <I18nProvider i18n={i18n}>{children}</I18nProvider>
  </ThemeProvider>
);

describe('CreateChecklistItemModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const userId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not open', () => {
    const { container } = render(
      <CreateChecklistItemModal
        open={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders form elements when open', () => {
    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    // Fix: Use getAllByText instead of getByText for duplicate "importance" elements
    expect(screen.getAllByText(/importance/i)[0]).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation messages when fields are touched and emptied', async () => {
    const user = userEvent.setup();
    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'a');
    await user.clear(titleInput);
    fireEvent.blur(titleInput);

    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, 'a');
    await user.clear(descInput);
    fireEvent.blur(descInput);

    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      },
      { timeout: 2000 },
    );

    await waitFor(
      () => {
        expect(descInput).toHaveAttribute('aria-invalid', 'true');
      },
      { timeout: 2000 },
    );

    expect(submitButton).toBeDisabled();
  });

  it('has disabled submit button when form is empty', () => {
    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // Create button should be disabled initially
    expect(screen.getByRole('button', { name: /create item/i })).toBeDisabled();
  });

  it('enables submit button when required fields are filled', async () => {
    const user = userEvent.setup();
    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    // Create button should be enabled
    expect(screen.getByRole('button', { name: /create item/i })).toBeEnabled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue({});

    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // 填写表单
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    const importanceSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(importanceSelect);

    await waitFor(() => {
      const mediumOption = screen.getByText(/medium/i);
      fireEvent.click(mediumOption);
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /create item/i }));

    // 验证提交数据(不包含ownerId,由调用者添加)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'This is a test description',
          importance: 'medium', // 小写格式
          isComplete: false,
        }),
      );

      // 关键:等待onClose被调用
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles submission error', async () => {
    const user = userEvent.setup();
    const errorMsg = 'Submission failed';
    mockOnSubmit.mockRejectedValue(new Error(errorMsg));

    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // 填写表单
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /create item/i }));

    // 验证错误消息显示
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });

    // 模态框不会关闭
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('disables form elements during submission', async () => {
    const user = userEvent.setup();
    // 使用延迟的 Promise 来模拟较长时间的提交
    mockOnSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // 填写表单
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /create item/i }));

    // 检查提交按钮是否禁用
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();

    // 等待提交完成
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('sets due date correctly', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // 填写基本表单
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    // Use the mocked date picker with data-testid
    const dateInput = screen.getByTestId('date-picker-input');
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /create item/i }));

    // 验证提交数据包含日期(字符串格式 ISO 8601)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          dueDate: '2025-12-31', // 字符串格式 'YYYY-MM-DD'
        }),
      );
    });
  });

  it('toggles completion checkbox correctly', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');

    // Find and click the checkbox
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create item/i }));

    // Check that isComplete is true in the submitted data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          isComplete: true,
        }),
      );
    });
  });

  it('resets form data when modal is reopened', () => {
    const { rerender } = render(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
      { wrapper: TestWrapper },
    );

    // Close and reopen the modal
    rerender(
      <CreateChecklistItemModal
        open={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
    );
    rerender(
      <CreateChecklistItemModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        userId={userId}
      />,
    );

    // Check that form fields are empty
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
