import React from "react"
import { useState } from "react"


const BlogForm = ({createBlog}) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes:0
    })
    setNewBlogTitle("")
    setNewBlogUrl("")
    setNewBlogAuthor("")
  }

  return(
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
            <input
              name='title'
              value={newBlogTitle}
              onChange={({target}) => setNewBlogTitle(target.value)}
            />
        </div>
        <div>
          author:
            <input
              name='author'
              value={newBlogAuthor}
              onChange={({target}) => setNewBlogAuthor(target.value)}
            />
        </div>
        <div>
          url:
            <input
              name='url'
              value={newBlogUrl}
              onChange={({target}) => setNewBlogUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default BlogForm