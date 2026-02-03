
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should navigate to login page', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Login');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByText('Login / Sign Up')).toBeVisible();
    });

    test('should validate phone input', async ({ page }) => {
        await page.goto('/login');

        const phoneInput = page.locator('input[type="tel"]');
        const submitBtn = page.getByRole('button', { name: 'Get OTP' });

        // Initially disabled or invalid
        await expect(submitBtn).toBeDisabled();

        // Enter invalid number
        await phoneInput.fill('123');
        await expect(submitBtn).toBeDisabled();

        // Enter valid number
        await phoneInput.fill('9876543210');
        await expect(submitBtn).toBeEnabled();
    });
});
