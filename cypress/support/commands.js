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

Cypress.Commands.add("addFormProperty", (fieldName, fieldType, isRequired, options = []) => {
  cy.get('.form-property-field-name-txt-input').type(fieldName);
  cy.get('.form-property-field-type-select-input').click();
  cy.get(`[data-value=${fieldType}]`).click();
  
  if(['radio', 'checkbox', 'dropdown'].includes(fieldType) && options.length){
    options.forEach((option, index) => {
      cy.get(`.form-property-field-type-option-txt-input-${index}`).type(option);

      // Don't click add option button for the last item in list
      if(index !== options.length - 1) {
        cy.get('.form-property-field-type-option-add-btn').click();
      }
    })
  }

  if(isRequired) {
    cy.get('.form-property-required-field-switch-btn').click();
  }
  
  cy.get('[data-testid=form_property_action_btn]').click();
  cy.wait(2000);
})
