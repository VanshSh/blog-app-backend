const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const totalLikeCount = blogs.reduce((acc, curr) => {
    return acc + curr.likes
  }, 0)
  return totalLikeCount
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  let maxLikes = -1
  let favorite = null

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]
    if (blog.likes && blog.likes > maxLikes) {
      maxLikes = blog.likes
      favorite = blog
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }
  let authorCount = {}
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]
    const author = blog.author
    if (authorCount[author]) {
      authorCount[author]++
    } else {
      authorCount[author] = 1
    }
  }
  let maxBlogs = 0
  let topAuthor = null
  for (const author in authorCount) {
    if (authorCount.hasOwnProperty(author)) {
      const blogCount = authorCount[author]

      if (blogCount > maxBlogs) {
        maxBlogs = blogCount
        topAuthor = author
      }
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  let authorLikes = {}

  for (let i = 0; i < blogs.length; i++) {
    let author = blogs[i].author
    let likes = blogs[i].likes

    if (authorLikes[author]) {
      authorLikes[author] += likes
    } else {
      authorLikes[author] = likes
    }
  }

  let topAuthor = ''
  let maxLikes = 0

  for (let author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      topAuthor = author
      maxLikes = authorLikes[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
