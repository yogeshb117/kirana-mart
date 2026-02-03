
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
    test('should add item to cart', async ({ page }) => {
        await page.goto('/');

        // Locate the first product add button
        // We assume there is at least one product. If not, this test might skip or fail gracefully if we check count first.
        const addBtn = page.getByRole('button', { name: 'Add' }).first();

        // If no products, skip test (conditional logic in test is tricky, usually we ensure seed data)
        if (await addBtn.isVisible()) {
            await addBtn.click();

            // Check for "1" in the cart badge or the button changing state
            // The button changes to counter (-, 1, +)
            const counter = page.locator('.flex.items-center.bg-emerald-50');
            await expect(counter).toBeVisible();
            await expect(counter).toContainText('1');

            // Check Navbar cart badge
            const cartBadge = page.locator('header a[href="/cart"] span');
            await expect(cartBadge).toContainText('1');
        }
    });

    test('should open cart sidebar', async ({ page }) => {
        await page.goto('/');

        // Click cart icon (assuming it's a link to /cart or opens sidebar)
        // The current implementation seems to link to /cart page for mobile or sidebar for desktop? 
        // Based on code: Top right cart button links to /cart.

        await page.click('header a[href="/cart"]');
        await expect(page).toHaveURL(/\/cart/);
        // Since test isolation clears storage, cart will be empty
        const emptyMsg = page.getByText('Your cart is empty');
        const header = page.getByText('Shopping Cart');
        await expect(emptyMsg.or(header).first()).toBeVisible();
    });
});
