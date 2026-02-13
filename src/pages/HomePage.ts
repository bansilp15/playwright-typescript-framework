import { Page } from '@playwright/test';

export class Homepage {
    private homepageTextXpath: string = '//div[@class="col-lg-8 hero-content text-center text-lg-start py-5"]';
    private homepageMenuXpath: string = '//div[@id="navbarNav"]/ul';
    private addressXpath: string = '(//div[@class="d-flex mb-4"])[1]/div[2]/p[1]';
    private phoneXpath: string = '(//div[@class="d-flex mb-4"])[2]/div[2]/p[1]';
    private emailXpath: string = '(//div[@class="d-flex mb-4"])[3]/div[2]/p[1]';
    private checkInDateInputXpath: string = '(//div[@class="react-datepicker__input-container"])[1]/input';
    private checkOutDateInputXpath: string = '(//div[@class="react-datepicker__input-container"])[2]/input';

    protected page: Page;

    constructor (page: Page) {
        this.page = page;
    }

    async getHomepageText(): Promise<string> {
        return await this.page.locator(this.homepageTextXpath).innerText();
    }
    
    async getHomepageMenu(): Promise<Array<string>> {
        let menu: Array<string> = [];
        const menuItems = await this.page.locator(this.homepageMenuXpath + '/li/a').all();
        for (const item of menuItems) {
            menu.push(await item.innerText());
        }    
        return menu;
    }

    async getAddress(): Promise<string> {
        return await this.page.locator(this.addressXpath).innerHTML();
    }

    async getPhone(): Promise<string>{
        return await this.page.locator(this.phoneXpath).innerHTML();
    }

    async getEmail(): Promise<string>{
        return await this.page.locator(this.emailXpath).innerHTML();
    }

    async setCheckInDate(date: string){
        await this.page.locator(this.checkInDateInputXpath).click();
        await this.page.locator(this.checkInDateInputXpath).fill(date);
        await this.page.keyboard.press('Tab');
    }

    async setCheckOutDate(date:string){
        await this.page.locator(this.checkOutDateInputXpath).click();
        await this.page.locator(this.checkOutDateInputXpath).fill(date);
        await this.page.keyboard.press('Tab');
    }

    async getCheckInDate(): Promise<string>{
        return await this.page.locator(this.checkInDateInputXpath).getAttribute('value') || '';
    }

    async getCheckOutDate(): Promise<string>{
        return await this.page.locator(this.checkOutDateInputXpath).getAttribute('value') || '';
    }

    async clickBookNow(){
        await this.page.getByRole('button', { name: 'Check Availability' }).click();
    }
}