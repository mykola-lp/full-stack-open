const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  const successDiv = page.getByText(
    `a new blog ${blog.title} by ${blog.author} added`
  )
  await expect(successDiv).toBeVisible()
  await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(
    page.getByRole('link', { name: `${blog.title} by ${blog.author}` })
  ).toBeVisible()
}

const likeTimes = async (page, button, n) => {
  for (let i = 0; i < n; i++) {
    await button.click()
    await button
      .locator('..')
      .getByText(`likes ${i + 1}`)
      .waitFor()
  }
}

export { createBlog, likeTimes, loginWith }
