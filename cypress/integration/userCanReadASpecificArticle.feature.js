describe('User can', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'GET',
      url: 'http://localhost:3000/api/articles',
      response: 'fixture:articles_data.json',
    })
  })

  describe('successfully', () => {
    beforeEach(() => {
      cy.server()
      cy.route({
        method: 'GET',
        url: 'http://localhost:3000/api/articles/1',
        response: 'fixture:single_article.json',
      })
      cy.route({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/sign_in',
        response: 'fixture:user_can_login.json',
      })
      cy.route({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/validate_token**',
        response: 'fixture:user_can_login.json',
      })
      cy.visit('/')
      cy.get("[data-cy='log-in-button']").click()
      cy.get("[data-cy='log-in-form']").within(() => {
        cy.get("[data-cy='log-in-email']").type('registered@user.com')
        cy.get("[data-cy='log-in-password']").type('password')
        cy.get("[data-cy='log-in-submit-btn']").click()
      })
      cy.get("[data-cy='article-index']").within(() => {
        cy.get("[data-cy='article-1']").click()
      })
    })
    it('read a specific article', () => {
      cy.get("[data-cy='article-display']").within(() => {
        cy.get("[data-cy='title']").should(
          'contain',
          'Cats are better than dogs!'
        )
        cy.get("[data-cy='lead']").should(
          'contain',
          'Have you noticed how smelly dogs are? Well that...'
        )
        cy.get("[data-cy='body']").should(
          'contain',
          "is because they don't clean them self as good as cat does. Cats are always nice smelling and very well behaved. This is no lie, it is a simple truth-fact for sure!!"
        )
      })
    })
  })

  describe('not see an article if improper params are provided', () => {
    beforeEach(() => {
      cy.server()
      cy.route({
        method: 'GET',
        url: 'http://localhost:3000/api/articles/3',
        response: {
          message: 'Something went wrong, this article was not found',
        },
        status: '404',
      })
      cy.route({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/sign_in',
        response: 'fixture:user_can_login.json',
      })
      cy.route({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/validate_token**',
        response: 'fixture:user_can_login.json',
      })
      cy.visit('/')
      cy.get("[data-cy='log-in-button']").click()
      cy.get("[data-cy='log-in-form']").within(() => {
        cy.get("[data-cy='log-in-email']").type('registered@user.com')
        cy.get("[data-cy='log-in-password']").type('password')
        cy.get("[data-cy='log-in-submit-btn']").click()
      })
      cy.get("[data-cy='article-3']").click()
    })
    it('and is presented with an error  message ', () => {
      cy.get("[data-cy='error-article']").should(
        'contain',
        'Something went wrong, this article was not found'
      )
    })
  })

  describe("NOT read article when they're not registered", () => {
    it('displays registration form', () => {
      cy.visit('/')
      cy.get("[data-cy='article-3']").click()
      cy.get("[data-cy='signup-form']").should('be.visible')
    })
  })
})
