import { test, expect } from '@playwright/test'

import { createBlog, loginWith } from './helper.js'

const testUser = {
  name: 'Playwright User',
  username: 'playwright-user',
  password: 'secret123',
}

test.describe('blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://127.0.0.1:3001/api/testing/reset')
    await request.post('http://127.0.0.1:3001/api/users', {
      data: testUser,
    })

    await page.goto('/')
  })

  test('shows navigation links for anonymous users', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
  })

  test('logged-in user can create a blog', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password)

    await createBlog(page, {
      title: 'Playwright created blog',
      author: 'QA Robot',
      url: 'https://example.com/playwright-created-blog',
    })
  })
})
