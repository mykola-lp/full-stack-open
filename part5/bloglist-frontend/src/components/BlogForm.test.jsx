import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {

  it('form calls event handler with correct details', async () => {
    const createBlogMock = vi.fn()

    render(<BlogForm createBlog={createBlogMock} />)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')

    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')

    await user.click(createButton)

    expect(createBlogMock).toHaveBeenCalledTimes(1)

    expect(createBlogMock.mock.calls[0][0]).toEqual({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com'
    })
  })
})