import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
});

async function searchAvailability(page: Page) {
    await page.getByRole('button', { name: 'Check Availability' }).click();
    await expect(page.getByRole('heading', { name: 'Single' })).toBeVisible({ timeout: 15000 });
}

test('Homepage displays the expected title', async ({ page }) => {
    await expect(page).toHaveTitle('Restful-booker-platform demo');
});

test('Homepage displays the welcome content', async ({ page }) => {
    const hero = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' }) });

    await expect(hero.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
    await expect(hero.getByText('A place so beautiful you will never want to leave.')).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Book Now' })).toHaveAttribute('href', '#booking');
});

test('Booking section displays both date fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Check Availability & Book Your Stay' })).toBeVisible();
    await expect(page.getByText('Check In', { exact: true })).toBeVisible();
    await expect(page.getByText('Check Out', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Check Availability' })).toBeVisible();
});

test('Date fields are initialized with consecutive dates', async ({ page }) => {
    const dateFields = page.locator('.react-datepicker__input-container input');

    await expect(dateFields).toHaveCount(2);
    const checkIn = await dateFields.nth(0).inputValue();
    const checkOut = await dateFields.nth(1).inputValue();

    expect(checkIn).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(checkOut).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(new Date(checkOut.split('/').reverse().join('-')).getTime() - new Date(checkIn.split('/').reverse().join('-')).getTime())
        .toBe(24 * 60 * 60 * 1000);
});

test('Availability search displays all room types', async ({ page }) => {
    await searchAvailability(page);
    await expect(page.getByRole('heading', { name: 'Double' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite' })).toBeVisible();
});

test('Room cards display the correct nightly prices', async ({ page }) => {
    await searchAvailability(page);

    await expect(page.getByText('£100 per night')).toBeVisible();
    await expect(page.getByText('£150 per night')).toBeVisible();
    await expect(page.getByText('£225 per night')).toBeVisible();
});

test('Room cards display their listed amenities', async ({ page }) => {
    await searchAvailability(page);

    await expect(page.getByRole('heading', { name: 'Single' }).locator('..').getByText('TV')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Double' }).locator('..').getByText('Radio')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite' }).locator('..').getByText('WiFi')).toBeVisible();
    await expect(page.getByText('Safe', { exact: true }).nth(0)).toBeVisible();
});

test('Room booking links include the selected stay dates', async ({ page }) => {
    await searchAvailability(page);

    const bookingLinks = page.locator('a[href^="/reservation/"]');
    await expect(bookingLinks).toHaveCount(3);
    await expect(bookingLinks.nth(0)).toHaveAttribute('href', /\/reservation\/1\?checkin=.*&checkout=.*/);
    await expect(bookingLinks.nth(1)).toHaveAttribute('href', /\/reservation\/2\?checkin=.*&checkout=.*/);
    await expect(bookingLinks.nth(2)).toHaveAttribute('href', /\/reservation\/3\?checkin=.*&checkout=.*/);
});

test('Location section displays the expected destination text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Our Location' })).toBeVisible();
    await expect(page.getByText('Find us in the beautiful Newingtonfordburyshire countryside')).toBeVisible();
});

test('Contact section exposes message form controls', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Send Us a Message' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Phone' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Subject' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});