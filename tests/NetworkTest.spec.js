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

test('Place the Order', async ({page}) => {
    const expectedNoOrderMessage = "You have No Orders to show at this time.";
    page.addInitScript(
        value => {
            window.localStorage.setItem('token', value);
        }, 
        response.token
    );
    await page.goto("https://rahulshettyacademy.com/client");
    await page.route(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/64020afa568c3e9fb1277fa8",
        async route => {
            // Intercept response - API
            const response = await page.request.fetch(route.request());
            let body = fakePayloadOrders;
            await route.fulfill(
                {
                    response,
                    body: JSON.stringify(fakePayloadOrders)
                }
            );
        }
    )
    await page.pause();
    await page.locator("button[routerlink*='myorder']").click();
    const noOrderMessage = await page.locator(`text="${expectedNoOrderMessage}"`).textContent();
    expect(noOrderMessage.includes(expectedNoOrderMessage)).toBeTruthy();
});