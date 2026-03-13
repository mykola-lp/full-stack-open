import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

describe('Blog component', () => {

  const blog = {
    title: 'Test Blog Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: { name: 'Alice', username: 'alice123' }
  }

  it('renders title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} />)

    // title + author are visible
    const titleAuthor = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleAuthor).toBeVisible()

    // details aren't rendered when visible=false
    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
  })

  it('shows URL and likes when view button is clicked', () => {
    render(<Blog blog={blog} />)

    const button = screen.getByText('view')

    fireEvent.click(button)

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
  })

  it('shows URL and likes when view button is clicked (querySelector version)', () => {
    const { container } = render(<Blog blog={blog} />)

    const button = container.querySelector('button')
    fireEvent.click(button)

    const urlDiv = container.querySelector('.blog-url')
    expect(urlDiv).toHaveTextContent(blog.url)

    const likesDiv = container.querySelector('.blog-likes')
    expect(likesDiv).toHaveTextContent(`likes ${blog.likes}`)
  })

  it('if like button is clicked twice, event handler is called twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLike={mockHandler}
        user={blog.user}
      />
    )

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    // 2 times click
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })

  it('remove button is shown to blog owner and calls handler when clicked', () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={blog.user} handleDelete={mockHandler} />)

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    const removeButton = screen.getByText('remove')
    expect(removeButton).toBeDefined()

    fireEvent.click(removeButton)
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})