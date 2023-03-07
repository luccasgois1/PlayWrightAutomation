const {test, expect} = require('@playwright/test');

test('Browser Context Playwright test - Wrong credentials', async ({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  // css, xpath
  console.log(await page.title());
  await page.locator('input#username').type("rahulshetty"); //id
  await page.locator('[type="password"]').type("learning"); //attribute
  await page.locator('input#signInBtn').click(); //id
  console.log(await page.locator('[style*="block"]').textContent());
  await expect(await page.locator('[style*="block"]')).toContainText("Incorrect username/password.")
});

test('Browser Context Playwright test - Right credentials', async ({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // await page.route('**/*.{jpg,png,jpeg,css}', route=>route.abort()); // Abort routes for import images
  page.on('request', request=> console.log('REQUEST --> ', request.url()));
  page.on('response', response=>console.log('RESPONSE <-- ',response.url(), response.status()));
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const locators = {
    userName: page.locator('input#username'),
    password: page.locator('[type="password"]'),
    singInBtn: page.locator('input#signInBtn'),
    cardTitles: page.locator('.card-body a'),
  };
  // css, xpath
  console.log(await page.title());
  await locators.userName.type("rahulshettyacademy");
  await locators.password.type("learning");
  // race condition if method does not have autowait
  await Promise.all(
    [
      page.waitForNavigation(),
      locators.singInBtn.click(),

    ]
  );
  console.log(await locators.cardTitles.allTextContents());
});

test('Page Playwright test', async ({page}) => {
  // Use the page on the input variables if you want a
  // zero default config page(Without options)
  await page.goto('https://google.com/');
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test('UI Controls', async ({page}) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const locators = {
    userName: page.locator('input#username'),
    password: page.locator('[type="password"]'),
    singInBtn: page.locator('input#signInBtn'),
    dropdown: page.locator('select.form-control'),
    radioBtn: page.locator('.radiotextsty'),
    popupOkBtn: page.locator('#okayBtn'),
    termsCheck: page.locator('#terms'),
  };
  await locators.dropdown.selectOption("consult");
  await locators.radioBtn.last().click()
  await locators.popupOkBtn.click()
  await expect(await locators.radioBtn.last()).toBeChecked();
  await locators.termsCheck.check();
  await expect(await locators.termsCheck).toBeChecked();
  await locators.termsCheck.uncheck();
  await expect(await locators.termsCheck).not.toBeChecked();
});

test('Child windows hadl', async ({browser}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const documentLink = page.locator("[href*='documents-request']");
  await expect(documentLink).toHaveAttribute('class', "blinkingText");
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click()
  ])
  const text = await newPage.locator(".red").textContent();
  const arrayText =  text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);
  await page.locator("#username").type(domain)
  console.log(await page.locator("#username").textContent());
});
