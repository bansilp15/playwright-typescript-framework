import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string=""): Promise<void> {
        await this.page.goto("/" + path, {waitUntil: 'domcontentloaded'});
    }
        
}