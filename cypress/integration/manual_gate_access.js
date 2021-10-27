/* eslint-disable no-undef */

describe('Manual Gate Access', () => {
    it('allows security guards to record manual entries', () => {
      cy.factory('community', { name: 'Nkwashi' }).then((res1) => {
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

      // Fill in the manual entry request form
      cy.get('[data-testid=entry_user_name]').type('Test Manual User')
      cy.get('[data-testid=email]').type('email@test.com')
      cy.get('[data-testid=entry_user_nrc]').type('0U2J0J239')
      cy.get('[data-testid=entry_user_phone]').type('0024067740149')
      cy.get('[data-testid=entry_user_vehicle]').type('AQW2714')
      cy.get('[data-testid=companyName]').type('AQW2714')
      cy.get('.visiting_reason').click()
      cy.get('[data-value=client]').click();

      // grant access
      cy.wait(500)
      cy.get('[data-testid=entry_user_next]').click()
      cy.wait(2000);
      // Add an observation
      cy.get('[data-testid=entry-dialog-field]').type('Observation example')
      cy.get('.save_and_record_other').click()

      // Check if Test Manual User was recorded in the logbook
      cy.visit('/entry_logs')
      cy.get('.entry-log-visitor-name').should('contain', 'Test Manual User')
      // check if an observation was successfully added
      cy.visit('/entry_logs?tab=3')
      cy.get('.exit_note').should('contain', 'Observation example')
    })
  })
