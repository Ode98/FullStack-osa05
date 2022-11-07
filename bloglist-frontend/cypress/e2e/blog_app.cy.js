describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()
      cy.contains('Wrong username or password')
    })
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('thisistitle')
      cy.get('#author').type('thisisauthor')
      cy.get('#url').type('thisisurl')
      cy.contains('create').click()
      cy.contains('thisistitle thisisauthor')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title:'thisistitle', author:'thisisauthor', url:'thisisurl' })
      cy.contains('view').click()
      cy.contains('like').click()
    })

    it.only('The blogs are in order by number of likes', function() {
      cy.createBlog({ title:'thisistitle1', author:'thisisauthor1', url:'thisisurl1' })
      cy.createBlog({ title:'thisistitle2', author:'thisisauthor2', url:'thisisurl2' })
      cy.createBlog({ title:'thisistitle3', author:'thisisauthor3', url:'thisisurl3' })

      cy.contains('thisistitle2 thisisauthor2')
        .contains('view')
        .click()
      cy.contains('like')
        .click()
      cy.contains('hide')
        .click()

      cy.contains('thisistitle3 thisisauthor3')
        .contains('view')
        .click()
      cy.contains('like')
        .click()
        .click()
      cy.contains('hide')
        .click()

      cy.get('.blog').eq(0).should('contain', 'thisistitle3 thisisauthor3')
      cy.get('.blog').eq(1).should('contain', 'thisistitle2 thisisauthor2')
      cy.get('.blog').eq(2).should('contain', 'thisistitle1 thisisauthor1')
    })

    it('A blog can be removed by user', function() {
      cy.createBlog({ title:'thisistitle', author:'thisisauthor', url:'thisisurl' })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'thisistitle thisisauthor')
    })
  })
})

