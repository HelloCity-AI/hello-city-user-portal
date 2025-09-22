import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/email/send', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // 访问 Contact Us 页面
    await page.goto('/en/contact-us');
  });

  test('Renders Contact Us title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('Allows user to fill out and submit the form successfully', async ({ page }) => {
    // 填写 Name
    await page.getByLabel('Name').fill('Shawn Test');
    // 填写 Email
    await page.getByLabel('Email').fill('shawn@example.com');
    // 填写 Message
    await page.getByLabel('Message').fill('Hello, this is a test message.');

    // 点击 Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // 等待并验证成功消息
    await expect(page.getByText('Message sent successfully!')).toBeVisible();

    // 验证表单已清空
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
    await expect(page.getByLabel('Message')).toHaveValue('');
  });

  test('Shows loading state during form submission', async ({ page }) => {
    // Mock a delayed response
    await page.route('**/email/send', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // 填写表单
    await page.getByLabel('Name').fill('Mario Test');
    await page.getByLabel('Email').fill('mario@example.com');
    await page.getByLabel('Message').fill('Hello, this is a test message.');

    // 点击 Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // 验证加载状态
    await expect(page.getByText('Sending...')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeDisabled();
    await expect(page.getByLabel('Email')).toBeDisabled();
    await expect(page.getByLabel('Message')).toBeDisabled();
  });

  test('Shows error message when API fails', async ({ page }) => {
    // Mock API failure
    await page.route('**/email/send', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    // 填写并提交表单
    await page.getByLabel('Name').fill('Mario Test');
    await page.getByLabel('Email').fill('mario@example.com');
    await page.getByLabel('Message').fill('Hello, this is a test message.');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 验证错误消息
    await expect(page.getByText('Failed to send message. Please try again.')).toBeVisible();

    // 验证表单没有清空
    await expect(page.getByLabel('Name')).toHaveValue('Mario Test');
    await expect(page.getByLabel('Email')).toHaveValue('mario@example.com');
    await expect(page.getByLabel('Message')).toHaveValue('Hello, this is a test message.');
  });
});
