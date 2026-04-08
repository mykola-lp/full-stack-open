import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import '@testing-library/jest-dom'

import BlogDetails from './BlogDetails'

describe('BlogDetails component', () => {

  const blog = {
    id: '12345',
    title: 'Test Blog Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: { name: 'Alice', username: 'alice123' }
  }

  it('shows blog information and likes to unauthenticated users, but no buttons', () => {
    render(<BlogDetails blog={blog} handleLike={vi.fn()} handleDelete={vi.fn()} user={null} />)

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  it('shows only the like button to authenticated users who are not the creator', () => {
    const anotherUser = {
      username: 'otheruser',
      name: 'Other User'
    }

    render(
      <BlogDetails
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        user={anotherUser}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  it('shows both like and remove buttons to the blog creator', () => {
    render(
      <BlogDetails
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        user={blog.user}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })
})
