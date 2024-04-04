import { test, expect, Locator } from '@playwright/test';

let searchBox: Locator;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.only('Realizar una búsqueda que no tenga resultados', async ({ page }) => {
  await page.getByRole('button', { name: 'Search' }).click();
  searchBox = page.getByPlaceholder('Search docs');
  await searchBox.click();
  await page.getByPlaceholder('Search docs').fill('hascontent');

  const RESULTS_MESSAGE = page.locator(
    '.DocSearch-NoResults p',
  );

  await expect(RESULTS_MESSAGE).toBeVisible();
  await expect(RESULTS_MESSAGE).toHaveText('No results for "hascontent"');
})

test('Limpiar el input de búsqueda', async ({ page }) => {
  await page.getByRole('button', { name: 'Search' }).click();

  const searchBox = page.getByPlaceholder('Search docs');

  await searchBox.click();

  await searchBox.fill('somerandomtext');

  await expect(searchBox).toHaveText('somerandomtext');

  await page.getByRole('button', { name: 'Clear the query' }).click();

  await expect(searchBox).toHaveAttribute('value', '');
});

test('Realizar una búsqueda que genere al menos tenga un resultado', async ({ page }) => {
  await page.getByRole('button', { name: 'Search ' }).click();

  const searchBox = page.getByPlaceholder('Search docs');

  await searchBox.click();

  await page.getByPlaceholder('Search docs').fill('havetext');

  expect(searchBox).toHaveText('havetext');

  // Verity there are sections in the results
  await page.locator('.DocSearch-Dropdown-Container section').nth(1).waitFor();
  const numberOfResults = await page.locator('.DocSearch-Dropdown-Container section').count();
  await expect(numberOfResults).toBeGreaterThan(0);

});