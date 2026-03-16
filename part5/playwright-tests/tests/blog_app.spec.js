// blogApp.spec.js
const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3001/api/testing/reset')

    // Create users via backend API
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Other User',
        username: 'other',
        password: 'pass123'
      }
    })

    // Open frontend
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'log in to application' })).toBeVisible()

    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="Username"]', 'testuser')
      await page.fill('input[name="Password"]', 'testpass')

      await page.getByRole('button', { name: 'login' }).click()
      // Expect the logged-in user's name to be visible
      await expect(page.locator('text=Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('wrongpass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('When logged in', () => {

    test.beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('testpass')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.locator('input').nth(0).fill('My Test Blog')
      await page.locator('input').nth(1).fill('Test Author')
      await page.locator('input').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('My Test Blog Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.locator('input').nth(0).fill('Like Test Blog')
      await page.locator('input').nth(1).fill('Test Author')
      await page.locator('input').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Like Test Blog Test Author').locator('..')

      await blog.getByRole('button', { name: 'view' }).click()

      const likes = blog.locator('.blog-likes')

      await expect(likes).toHaveText(/likes 0/i)

      await blog.getByRole('button', { name: 'like' }).click()

      await expect(likes).toHaveText(/likes 1/i)
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.locator('input').nth(0).fill('Delete Test Blog')
      await page.locator('input').nth(1).fill('Test Author')
      await page.locator('input').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Delete Test Blog Test Author')

      await blog.locator('..').getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())

      await blog.locator('..').getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Delete Test Blog Test Author')).toHaveCount(0)
    })

    test('delete button is visible only to the creator', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.locator('input').nth(0).fill('Visibility Blog')
      await page.locator('input').nth(1).fill('Author')
      await page.locator('input').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Visibility Blog Author')

      await blog.locator('..').getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.locator('input[name="Username"]').fill('other')
      await page.locator('input[name="Password"]').fill('pass123')

      await page.getByRole('button', { name: 'login' }).click()

      await page.getByText('Visibility Blog Author')
        .locator('..')
        .getByRole('button', { name: 'view' })
        .click()

      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes', async ({ page }) => {
      // create blog 1
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Blog A')
      await page.locator('input').nth(1).fill('Author')
      await page.locator('input').nth(2).fill('url')
      await page.getByRole('button', { name: 'create' }).click()

      // create blog 2
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Blog B')
      await page.locator('input').nth(1).fill('Author')
      await page.locator('input').nth(2).fill('url')
      await page.getByRole('button', { name: 'create' }).click()

      // open both blogs
      const blogs = page.locator('.blog')

      await blogs.nth(0).getByRole('button', { name: 'view' }).click()
      await blogs.nth(1).getByRole('button', { name: 'view' }).click()

      // like Blog B twice
      const blogB = page.getByText('Blog B Author').locator('..')

      await blogB.getByRole('button', { name: 'like' }).click()
      await blogB.getByRole('button', { name: 'like' }).click()

      // wait for sorting
      await page.waitForTimeout(500)

      const orderedBlogs = page.locator('.blog')

      await expect(orderedBlogs.nth(0)).toContainText('Blog B')
      await expect(orderedBlogs.nth(1)).toContainText('Blog A')
    })
  })
})