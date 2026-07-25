import { test, expect, request } from '@playwright/test'

test('Create Articles', async ({ page, request }) => {
    await page.goto('/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: 'Email' }).fill('user7654321@test.com')
    await page.getByRole('textbox', { name: 'password' }).fill('user7654321')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.getByText('New Article').click()
    await page.getByRole('textbox', { name: 'Article Title' }).fill('it is an article')
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('about playwright')
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('i like playwright')
    await page.getByRole('button', { name: 'Publish Article' }).click()
    await expect(page.locator('.article-page h1')).toContainText('it is an article')

    await page.getByText('Home').first().click()
    await page.getByText('Global Feed').click()

    await page.getByText('it is an article').click()
    await page.getByRole('button', { name: 'Delete Article' }).first().click()
    await page.getByText('Global Feed').click()















}
)