const {test, expect} = require('@playwright/test');

test('Browser Context-Validating Error login', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle'); // Wait for all network work has done(service base)
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
})

test.only('Client App login', async ({page}) => {
    const productName = "zara coat 3";
    const email = "anshika@gmail.com";
    const products = await page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await Promise.all(
        [
            await page.locator("[value='Login']").click(),
            await page.waitForLoadState('networkidle'), // Wait for all network work has done(service base)
        ]
      );
    for (let i = 0; i < (await products.count()); i++){
        if(await products.nth(i).locator("b").textContent() === productName){
            await products.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    const checkoutBtn = page.locator("button")
        .locator("text=Checkout");
    await checkoutBtn.waitFor();
    expect(
        await page.locator('h3')
            .locator(`text=${productName}`)
            .isVisible()
    ).toBeTruthy();
    await checkoutBtn.click();
    await page.locator("[placeholder*='Country']")
        .type("ind",{delay: 100});
    await page.locator(".ta-results")
        .locator("text='India'")
        .click();
    await expect(
        page.locator('[class*="user__name"] label[type="text"]')
    ).toHaveText(email);
    await page.locator(".actions a").click();
    await expect(
        page.locator(".hero-primary")
    ).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log(orderId);
    await page.locator("button[routerlink*='myorder']").click();
    const tableRows = page.locator('tbody tr');
    await tableRows.first().waitFor();
    for (let i = 0; i < (await tableRows.count()); i++) {
        const orderIdOnRow = await tableRows.locator('th').nth(i).textContent()
        if(orderId.includes(orderIdOnRow)){
            tableRows.nth(i).locator('button').first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator("[class*='col-text -main']").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
});