import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const blog = {
  title: 'this_is_title',
  author: 'this_is_author',
  likes: 4,
  url: 'this_is_url',
  user: 'this_is_user'
}

test('renders blog title ard author', () => {

  render(<Blog blog={blog}/>)
  const element = screen.getByText('this_is_title this_is_author')
  const element2 = screen.queryByText('this_is_url')
  const element3 = screen.queryByText('4')
  const element4 = screen.queryByText('this_is_user')
  expect(element).toBeDefined()
  expect(element2).toBeNull()
  expect(element3).toBeNull()
  expect(element4).toBeNull()
  screen.debug()
})

test('renders also url and likes when button "view" is pressed', async () => {

  render(
    <Blog blog={blog}/>
  )
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const element1 = screen.queryByText('this_is_url')
  const element2 = screen.queryByText('4')
  const element3 = screen.queryByText('this_is_user')
  expect(element1).toBeDefined()
  expect(element2).toBeDefined()
  expect(element3).toBeDefined()
})

test('When button "like" is pressed twice, likeHandler is called twice', async () => {

  const mockHandler = jest.fn()
  const component = render(
    <Blog blog={blog} likeBlog={mockHandler}/>
  )
  const user = userEvent.setup()
  const button = component.getByText('view')
  await user.click(button)
  const button2 = component.getByText('like')
  await user.click(button2)
  await user.click(button2)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'otsikko')
  await user.type(inputs[1], 'kirjailija')
  await user.type(inputs[2], 'linkki')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('otsikko')
  expect(createBlog.mock.calls[0][0].author).toBe('kirjailija')
  expect(createBlog.mock.calls[0][0].url).toBe('linkki')
})