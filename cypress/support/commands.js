/* eslint-disable no-undef */
Cypress.Commands.add("resetDatabase", () => {
  cy.request('DELETE', '/cypress/cleanup').as('cleanup')
})

Cypress.Commands.add("factory", (name, attributes) => {
  cy.request('POST', '/cypress/factories', {
    name,
    attributes: attributes || {}
  }).as('test data')
})
