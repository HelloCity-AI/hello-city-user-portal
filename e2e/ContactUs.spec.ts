import { test, expect } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.beforeEach(async ({ page }) => {
    // 访问 Contact Us 页面
    await page.goto('/contact-us');
  });

  test('renders Contact Us title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('allows user to fill out the form', async ({ page }) => {
    // 填写 Name
    await page.getByLabel('Name').fill('Mario Test');
    // 填写 Email
    await page.getByLabel('Email').fill('mario@example.com');
    // 填写 Message
    await page.getByLabel('Message').fill('Hello, this is a test message.');

    // 点击 Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // 断言 alert 被触发
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Mario Test');
      expect(dialog.message()).toContain('mario@example.com');
      expect(dialog.message()).toContain('Hello, this is a test message.');
      await dialog.dismiss(); // 关闭 alert
    });
  });
});
