const { test, expect, request } = require("@playwright/test");
const {APIUtils} = require('./utils/APIUtils');
const loginPayLoad = {userEmail:"josephklimber@gmail.com", userPassword: "Test12345678"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
let response;
test.beforeAll( async () =>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});

test('Place the Order', async ({page}) => {
    page.addInitScript(
        value => {
            window.localStorage.setItem('token', value);
        }, 
        response.token
    );
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorder']").click();
    const tableRows = page.locator('tbody tr');
    await tableRows.first().waitFor();
    for (let i = 0; i < (await tableRows.count()); i++) {
        const orderIdOnRow = await tableRows.locator('th').nth(i).textContent()
        if(response.orderId.includes(orderIdOnRow)){
            tableRows.nth(i).locator('button').first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator("[class*='col-text -main']").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});