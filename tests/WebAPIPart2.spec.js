// Login UI -> .json

// test browser -> .json, cart-, order, orderdetails, orderhistory

const {test, expect} = require('@playwright/test');
const loginPayLoad = {userEmail:"josephklimber@gmail.com", userPassword: "Test12345678"};
let webContext;
test.beforeAll( async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(loginPayLoad.userEmail);
    await page.locator("#userPassword").fill(loginPayLoad.userPassword);
    await Promise.all(
        [
            await page.locator("[value='Login']").click(),
            await page.waitForLoadState('networkidle'), // Wait for all network work has done(service base)
        ]
    );
    await context.storageState({path: 'state.json'});
    webContext = await browser.newContext({storageState: 'state.json'});
})


test('Client App login', async () => {
    const productName = "zara coat 3";
    const email = "anshika@gmail.com";
    const page = await webContext.newPage();
    const products = await page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
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