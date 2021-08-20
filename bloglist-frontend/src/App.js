import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification  from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'


const App = () => {
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const handleRemove = blogToRemove => {
    window.confirm("Remove blog?")
    blogService.remove(blogToRemove.id, user.token)
    setBlogs(blogs.filter(a => a !== blogToRemove))
  }

  const handleLike = (blog, blogLikes) => {
    blogService.update(
      blog.id,
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blogLikes +1,
        user:user.id
      }
    )
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(
        returnedNote => {setBlogs(blogs.concat(returnedNote))
        setNotificationMessage(`A new blog ${returnedNote.title} by ${returnedNote.author}`)
        resetNotification()
        }
      )
  }

  const resetNotification = (message) => {
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage("Wrong username or password")
      resetNotification()
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage}/>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage}/>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
  
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} removeBlog={handleRemove} likeBlog={handleLike} />
      )}

      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

    </div>
  )
}


export default App