/* eslint-disable no-undef */

describe('Manual Gate Access', () => {
    it('allows security guards to record manual entries', () => {
      cy.factory('community', { name: 'Nkwashi' }).then((res1) => {
        cy.factory('admin_user', {
          name: 'An Admin User',
          phone_number: '2348167740149',
          email: 'adminuser@gmail.com',
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
  
      // Login: Security Guard
      cy.login('2347065834175')
      cy.visit('/request')
  
      cy.get('[data-testid=entry_user_name]').type('Test Manual User')
      cy.get('[data-testid=email]').type('email@test.com')
      cy.get('[data-testid=entry_user_nrc]').type('0U2J0J239')
      cy.get('[data-testid=entry_user_phone]').type('0024067740149')
      cy.get('[data-testid=entry_user_vehicle]').type('AQW2714')
      cy.get('[data-testid=companyName]').type('AQW2714')
      cy.get('[data-testid=entry_user_visit]').select('Client')
      cy.wait(1000)
      cy.get('[data-testid=entry_user_grant_request]').click()
    })
  })
  