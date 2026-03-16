describe('Blog app', function () {

  beforeEach(function () {
    // reset database before each test
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    // create test user via backend
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }
    // add user via backend API
    cy.request('POST', 'http://localhost:3001/api/users', user)

     // open frontend app
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
    cy.contains('button', 'login')
  })


  describe('Login', function () {

    it('succeeds with correct credentials', function () {

      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('testpass')

      cy.contains('button', 'login').click()

      cy.contains('Test User logged in')
    })


    it('fails with wrong credentials', function () {

      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('wrongpass')

      cy.contains('button', 'login').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function () {

    beforeEach(function () {
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('testpass')

      cy.contains('button', 'login').click()

      cy.contains('Test User logged in')
    })

    it(`A blog can be created`, function () {
      // open blog creation form
      cy.contains('create new blog').click()
  
      // type blog title
      cy.contains('title')
        .parent()
        .find('input')
        .type('Cypress Blog Test')
  
      // type blog author
      cy.contains('author')
        .parent()
        .find('input')
        .type('Cypress Tester')
  
      // type blog url
      cy.contains('url')
        .parent()
        .find('input')
        .type('http://cypress-test.com')

      // submit blog creation
      cy.get('form').contains('button', 'create').click()

      // verify blog appears in list
      cy.contains('Cypress Blog Test')
      cy.contains('Cypress Tester')
    })

    it('A blog can be liked', function() {
      // open blog creation form
      cy.contains('create new blog').click()

      // the form is visible now, fill blog fields
      cy.get('input').eq(0).type('Like Test Blog') // title
      cy.get('input').eq(1).type('Test Author')    // author
      cy.get('input').eq(2).type('http://example.com') // url

      // submit form
      cy.get('form').within(() => {
        cy.contains('create').should('be.visible').click()
      })

      // wait until blog appears
      cy.contains('Like Test Blog')
        .should('be.visible')
        .parent()
        .as('theBlog')

      // open blog details
      cy.get('@theBlog')
        .contains('view')
        .click()

      // check initial likes
      cy.get('@theBlog').contains('likes 0')

      // click like
      cy.get('@theBlog')
        .contains('like')
        .click()

      // verify likes updated
      cy.get('@theBlog').contains('likes 1')
    })

    it('A blog can be deleted by the creator', function () {
      // open blog creation form
      cy.contains('create new blog').click()

      // fill blog form
      cy.get('form').within(() => {
        cy.contains('title').parent().find('input').type('Delete Test Blog')
        cy.contains('author').parent().find('input').type('Tester')
        cy.contains('url').parent().find('input').type('http://delete-test.com')
        cy.contains('button', 'create').should('be.visible').click()
      })

      // wait until blog appears
      cy.contains('Delete Test Blog')
        .should('be.visible')
        .parent()
        .as('theBlog') // alias

      // open blog details
      cy.get('@theBlog')
        .contains('view')
        .click()

      // remove blog
      cy.get('@theBlog')
        .contains('remove')
        .should('be.visible')
        .click()

      // verify blog removed
      cy.contains('Delete Test Blog', { timeout: 10000 }).should('not.exist')
    })

    it('Only the creator can see the delete button', function () {
      // create blog
      cy.contains('create new blog').click()

      cy.get('form').within(() => {
        cy.contains('title').parent().find('input').type('Creator Test Blog')
        cy.contains('author').parent().find('input').type('Tester')
        cy.contains('url').parent().find('input').type('http://creator-test.com')
        cy.contains('button', 'create').click()
      })

      // wait for blog to appear
      cy.contains('Creator Test Blog')
        .should('be.visible')
        .parent()
        .as('theBlog')

      // open blog details
      cy.get('@theBlog').contains('view').click()

      // creator should see remove button
      cy.get('@theBlog').contains('remove').should('be.visible')

      // logout
      cy.contains('logout').click()

      // create second user via API
      const user2 = {
        name: 'Second User',
        username: 'seconduser',
        password: 'testpass'
      }
      cy.request('POST', 'http://localhost:3001/api/users', user2)

      // login second user
      cy.get('input[name="Username"]').type('seconduser')
      cy.get('input[name="Password"]').type('testpass')
      cy.contains('button', 'login').click()

      // wait for blog to appear
      cy.contains('Creator Test Blog')
        .should('be.visible')
        .parent()
        .as('theBlog2')

      // open blog details
      cy.get('@theBlog2').contains('view').click()

      // remove button should not exist
      cy.get('@theBlog2').contains('remove').should('not.exist')
    })

    it('Blogs are ordered by likes, most liked first', function() {
      const blogs = [
        { title: 'Blog A', author: 'Author A', url: 'http://a.com' },
        { title: 'Blog B', author: 'Author B', url: 'http://b.com' },
        { title: 'Blog C', author: 'Author C', url: 'http://c.com' },
      ]

      // create blogs
      blogs.forEach(blog => {
        cy.contains('create new blog').click()

        cy.get('form').within(() => {
          cy.get('input').eq(0).type(blog.title)
          cy.get('input').eq(1).type(blog.author)
          cy.get('input').eq(2).type(blog.url)
          cy.contains('create').click()
        })
      })

      // open blog details
      cy.contains('.blog', 'Blog A').contains('view').click()
      cy.contains('.blog', 'Blog B').contains('view').click()
      cy.contains('.blog', 'Blog C').contains('view').click()

      const like = (title, times) => {
        for (let i = 0; i < times; i++) {
          cy.contains('.blog', title)
            .contains('like')
            .click()

          cy.contains('.blog', title)
            .contains(`likes ${i + 1}`, { timeout: 10000 })
        }
      }

      // add likes
      like('Blog A', 2)
      like('Blog B', 5)
      like('Blog C', 3)

      // verify order by likes
      cy.get('.blog').eq(0).should('contain', 'Blog B')
      cy.get('.blog').eq(1).should('contain', 'Blog C')
      cy.get('.blog').eq(2).should('contain', 'Blog A')
    })
  })
})