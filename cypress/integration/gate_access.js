/* eslint-disable no-undef */

describe('Gate Access', () => {
  it('runs gate access scenario', () => {
    cy.login('Nkwashi', 'security_guard', 'A Guard', '2347065834175', 'guard.dgdp@gmail.com')
  })

  // it('clicks next button', () => {
  //   cy.visit('/')
  // })
})
