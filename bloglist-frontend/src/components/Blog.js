import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog, likeBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)

  const handleClick = () => {
    setVisible(!visible)
  }

  if (!visible) {
    return(
      <div className='blog'style={blogStyle}>
        {blog.title} {blog.author} <button onClick={handleClick}>view</button>
      </div>
    )
  } else {
    return(
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={handleClick}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes: {blogLikes} <button onClick={() => {setBlogLikes(blogLikes + 1); likeBlog(blog, blogLikes)}}>like</button>
        </div>
        {blog.user.name}
        <div>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired
}

export default Blog