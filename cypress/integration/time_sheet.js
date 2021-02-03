/* eslint-disable no-undef */

describe('Time Sheet', () => {
  it('allows custodian to record time shift', () => {
    cy.factory('community', { name: 'Nkwashi' }).then((res1) => {
      cy.factory('store_custodian', {
        name: 'Mr Custodian',
        phone_number: '2348167740149',
        email: 'custodian@gmail.com',
        state: 'valid',
        community_id: res1.body.id
      })

      cy.factory('security_guard', {
        name: 'A Guard',
        phone_number: '2347065834175',
        email: 'guard.dgdp@gmail.com',
        community_id: res1.body.id,
      })
    })

    cy.login('2348167740149')
    cy.visit('/search')

    cy.get('.user-search-input').type('A Guard').type("{enter}")
    cy.wait(2000)
    cy.get('.user-search-result').click()
    cy.wait(1000)
    cy.get('#closeBtn').click()
    cy.get('.start-shift-btn').click()
    cy.wait(20000)
    cy.get('.end-shift-btn').click()

    cy.visit('/timesheet')

    cy.get('.shift-user-name').should('contain', 'A Guard')
  })
})
