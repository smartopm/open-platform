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

// We might need to create a generic fetch* to support multiple resources
// if the need arises
Cypress.Commands.add("fetchUser", (phone) => {
  cy.request('POST', '/cypress/user', {
    phone
  })
})

Cypress.Commands.add("login", (phoneNumber) => {
  cy.visit('/')

  cy.get('.phone-login-input').clear().type(phoneNumber)
  cy.get('.next-btn').click()

  cy.wait(2000)

  cy.fetchUser(phoneNumber).then((response) => {
    response.body.phone_token.split('').forEach((digit, index) => {
      cy.get(`.code-input-${index}`).type(digit)
    })
    cy.wait(2000)
  })
})
