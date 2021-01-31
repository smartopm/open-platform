/* eslint-disable no-undef */

import './commands'

after(() => {
  cy.resetDatabase()
})
