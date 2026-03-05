const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const listWithMultipleBlogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Alice',
      likes: 5,
      __v: 0
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Bob',
      likes: 3,
      __v: 0
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Alice',
      likes: 7,
      __v: 0
    },
    {
      _id: '4',
      title: 'Blog 4',
      author: 'Bob',
      likes: 2,
      __v: 0
    },
    {
      _id: '5',
      title: 'Blog 5',
      author: 'Alice',
      likes: 1,
      __v: 0
    }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Alice',
      blogs: 3
    })
  })

  test('returns null for empty list', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBeNull()
  })
})
