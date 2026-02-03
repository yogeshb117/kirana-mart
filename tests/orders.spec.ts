
import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/orders');
        // Should be redirected to login
        await expect(page).toHaveURL(/.*\/login/);
    });
});
