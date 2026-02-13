import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { Homepage } from '../pages/HomePage';
import { resolve } from 'path';

let basePage: BasePage;
let homePage: Homepage;

test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    homePage = new Homepage(page);
    await basePage.navigate();
});

test('Verify HomePage text', async({ page }) => {
    await page.waitForTimeout(5000);

    await test.step('Homepage has correct title', async () => {
        await expect(page).toHaveTitle('Restful-booker-platform demo');
    });

    await test.step('Homepage text is correct', async () => {
        const expectedHomePageText = "Welcome to Shady Meadows B&B\n\n" + 
                                    "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. " + 
                                    "A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide " +
                                    "breakfast from the locally sourced supermarket. It is a delightful place.\n\nBook Now";

        await expect(await homePage.getHomepageText()).toEqual(expectedHomePageText);
    });

    await test.step('Homepage menu items are correct', async () => {
        const expectedMenuItems: Array<string> = ["Rooms", "Booking", "Amenities", "Location", "Contact", "Admin"]
        const actualMenuItems: Array<string> = await homePage.getHomepageMenu();
        for (let i = 0; i < expectedMenuItems.length; i++) {
            await expect(actualMenuItems[i]).toEqual(expectedMenuItems[i]);
        }
    });
});

test('Verify Contact Information', async ({ page }) => {
    await page.waitForTimeout(5000);

    await test.step('Address is correct', async() =>{
        const expectedAddress: string = "Shady Meadows B&amp;B, Shadows valley, Newingtonfordburyshire, Dilbery, N1 1AA";
        console.log(await homePage.getAddress());
        await expect (await homePage.getAddress()).toEqual(expectedAddress);
    });

    await test.step('Phone number is correct', async() => {
        const expectedPhoneNumber: string = "012345678901";
        await expect(await homePage.getPhone()).toEqual(expectedPhoneNumber);
    });

    await test.step('Email is correct', async() =>{
        const expectedEmail: string = "fake@fakeemail.com";
        await expect(await homePage.getEmail()).toEqual(expectedEmail);
    });
});

test('Verify able to change Check in and Check out dates', async ({ page }) => {
    await page.waitForTimeout(5000);

    await test.step('Verify correct check in and check out dates are set', async() => {
        const today = new Date();
        const day = today.getDate();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const expectedCheckIn = `${day}/${month}/${year}`;
        const expectedCheckOut = `${day + 1}/${month}/${year}`;
        
        console.log('Expected Check-in:', expectedCheckIn);
        console.log('Expected Check-out:', expectedCheckOut);
        
        await expect(await homePage.getCheckInDate()).toEqual(expectedCheckIn);  
        await expect(await homePage.getCheckOutDate()).toEqual(expectedCheckOut);
    });

    await test.step('Click Book Now button', async() =>{
        await homePage.clickBookNow();
    });
});

test.afterEach(async ({ page }, testInfo) => {
    await page.screenshot({path: `./test-results/screenshots/Homepage_${testInfo.title}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getDate()}_${new Date().getMonth()+1}_${new Date().getFullYear()}.png`});
    await page.close();
});
