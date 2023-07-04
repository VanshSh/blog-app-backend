const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const totalLikeCount = blogs.reduce((acc, curr) => {
    return acc + curr.likes
  }, 0)
  return totalLikeCount
}

module.exports = {
  dummy,
  totalLikes,
}
