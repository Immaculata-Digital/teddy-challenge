import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Pela lógica atual, rotas não autenticadas redirecionam para /login
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('h1')).toContainText(/Bem-vindo de volta/i);
});

test('can navigate to register page', async ({ page }) => {
  await page.goto('/login');
  await page.getByText(/Crie aqui/i).click();
  await expect(page).toHaveURL(/.*register/);
});
