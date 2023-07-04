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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
