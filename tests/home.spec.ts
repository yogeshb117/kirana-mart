
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should display premium banner and navigation', async ({ page }) => {
        await page.goto('/');

        // Check title or logo text
        await expect(page.locator('header').getByText('Shubh Lakshmi')).toBeVisible();

        // Check Hero Banner
        await expect(page.getByText('Premium Grocery Delivery')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Shop Now' })).toBeVisible();

        // Check Search Bar
        await expect(page.getByPlaceholder('Search products (e.g. Atta, Dal)...')).toBeVisible();
    });

    test('should display product categories or empty state', async ({ page }) => {
        await page.goto('/');

        // We expect either products or the "No Products Found" message
        const productsGrid = page.locator('.grid');
        const emptyState = page.getByText('No Products Found');

        // Wait for data content to load (since it's server component but verify hydration)
        // This is a loose check: either grid exists OR empty state exists
        await expect(productsGrid.or(emptyState).first()).toBeVisible();
    });
});
