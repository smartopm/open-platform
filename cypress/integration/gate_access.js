/* eslint-disable no-undef */

describe('Gate Access', () => {
  it('runs gate access scenario', () => {
    // cy.factory('user', { name: 'Jide Kola' })

    cy.visit('/')

    cy.get('.justify-content-center h4')
      .should('contain', 'Welcome to Nkwashi App')
  })
})
