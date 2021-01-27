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

Cypress.Commands.add("fetchRecord", (resource, id) => {
  cy.request('POST', '/cypress/record', {
    resource,
    id
  })
})

// userType should be a valid user factory e.g 'admin_user', 'security_guard', 'store_custodian', etc
Cypress.Commands.add("login", (communityName, userType, userName, userPhone, userEmail) => {
  cy.factory('community', { name: communityName }).then((res1) => {
    cy.factory(userType, {
      name: userName,
      phone_number: userPhone,
      email: userEmail,
      community_id: res1.body.id
    }).then((res2) => {
      cy.visit('/')

      cy.get('.phone-login-input').clear().type(userPhone)
      cy.get('.next-btn').click()

      cy.wait(2000)

      cy.fetchRecord('user', res2.body.id).then((res3) => {
        res3.body.phone_token.split('').forEach((digit, index) => {
          cy.get(`.code-input-${index}`).type(digit)
        })

        cy.get('body').should('contain', 'Powered by DoubleGDP')
      })
    })
  })
})
