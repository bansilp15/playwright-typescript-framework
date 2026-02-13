import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: "./src/tests",
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    timeout: 30000,
    retries: process.env.CI ? 2 : 1,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter:[
        ['json', {outputFolder: 'test-results/json-report'}],
        ['allure-playwright']
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: "https://automationintesting.online",
        headless: true,
        viewport: { width: 1280, height: 720 },
        trace: "retain-on-failure",
        video: "retain-on-failure"
    },

    /* Configure projects for major browsers */
    projects:[
        {
            name: "chromium",
            use: { ...devices['Desktop Chrome']},
        },

        /*{
            name: "firefox",
            use: { ...devices['Desktop Firefox']}
        },
        /* Test against branded browsers. */
        /*{
            name: 'Microsoft Edge',
            use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
        {
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        },*/
    ]
});