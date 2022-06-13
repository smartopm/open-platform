describe('Manual Gate Access', () => {
  it('allows security guards to record manual entries', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(commRes => {
      cy.factory('role', {
        name: 'security_guard'
      }).then(guardRes => {
        cy.factory('permission', {
          module: 'entry_request',
          permissions: [
            'can_access_logbook',
            'can_see_menu_item',
            'can_go_through_guest_verification',
            'can_grant_entry',
            'can_create_entry_request',
            'can_add_entry_request_note'
          ],
          role_id: guardRes.body.id
        });
        cy.factory('permission', {
          module: 'user',
          permissions: ['can_view_guests'],
          role_id: guardRes.body.id
        });
        cy.factory('permission', {
          module: 'gate_access',
          permissions: ['can_see_menu_item'],
          role_id: guardRes.body.id
        });

        cy.factory('security_guard', {
          name: 'A Guard',
          phone_number: '2347065834175',
          email: 'guard.dgdp@gmail.com',
          community_id: commRes.body.id,
          role_id: guardRes.body.id
        });
      });
    });

    // Login: Security Guard
    cy.login('2347065834175');
    cy.visit('/request');

    // Fill in the manual entry request form
    cy.get('[data-testid=entry_user_name]').type('Test Manual User');
    cy.get('[data-testid=email]').type('email@test.com');
    cy.get('[data-testid=entry_user_nrc]').type('0U2J0J239');
    cy.get('[data-testid=entry_user_phone]').type('0024067740149');
    cy.get('[data-testid=entry_user_vehicle]').type('AQW2714');
    cy.get('[data-testid=companyName]').type('AQW2714');
    cy.get('.visiting_reason').click();
    cy.get('[data-value=client]').click();

    // grant access
    cy.wait(500);
    cy.get('[data-testid=entry_user_grant]').click();
    cy.wait(2000);
    // Add an observation
    cy.get('[data-testid=entry-dialog-field]').type('Observation example');
    cy.get('.save_and_record_other').click();

    // Check if Test Manual User was recorded in the logbook
    cy.visit('/logbook');
    cy.get('.entry-log-visitor-name').should('contain', 'Test Manual User');
    // check if an observation was successfully added
    cy.get('[data-testid=observation_note]').should('contain', 'Observation example');
  });
});
