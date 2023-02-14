const {test} = require('@playwright/test');

test('Browser Context Playwright test', async ({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
});

test('Page Playwright test', async ({page}) => {
  // Use the page on the input variables if you want a
  // zero default config page(Without options)
  await page.goto('https://google.com/');
});
