class LoginPage{

    constructor(page){
        this.page = page;
        this.userName = this.page.locator("#userEmail");
        this.password = this.page.locator("#userPassword");
        this.singInBtn = this.page.locator("[value='Login']");
    }

    async validLogin(email, password){
        await this.userName.type(email);
        await this.password.type(password);
        await this.singInBtn.click();
    }

    async goTo(){
        await this.page.goto("https://rahulshettyacademy.com/client");
    }
}
module.exports = {LoginPage};