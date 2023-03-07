const { test, expect, request } = require("@playwright/test");
const {APIUtils} = require('./utils/APIUtils');
const loginPayLoad = {userEmail:"josephklimber@gmail.com", userPassword: "Test12345678"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
const fakePayloadOrders = {data: [],message: "No Orders"}
let response;
test.beforeAll( async () =>{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});

test.skip('Place the Order', async ({page}) => {
    page.addInitScript(
        value => {
            window.localStorage.setItem('token', value);
        }, 
        response.token
    );
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("button[routerlink*='myorder']").click();
    await page.route(
        `https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=${response.orderId}`,
        route => route.continue({url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=64064d84568c3e9fb12a4530"})
    )
    await page.locator("button:has-text('View')").last().click();
    await page.locator("text='You are not authorize to view this order'").waitFor();
    expect(
        await page.locator("text='You are not authorize to view this order'").isVisible()
    ).toBeTruthy();
});