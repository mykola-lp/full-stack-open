const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, current) => (current.likes > prev.likes ? current : prev))
}

const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const counts = _.map(grouped, (authorBlogs, author) => ({
    author,
    blogs: authorBlogs.length
  }))

  return _.maxBy(counts, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = {}

  blogs.forEach((blog) => {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxAuthor = author
      maxLikes = likesCount[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
