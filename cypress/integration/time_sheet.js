describe('Time Sheet', () => {
  it('allows custodian to record time shift', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(commRes => {
      cy.factory('role', {
        name: 'security_guard'
      }).then(guardRes => {
        cy.factory('permission', {
          module: 'timesheet',
          permissions: ['can_fetch_user_time_sheet_logs'],
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
      cy.factory('role', {
        name: 'custodian'
      }).then(custodianRoleRes => {
        cy.factory('permission', {
          module: 'timesheet',
          permissions: [
            'can_manage_shift',
            'can_fetch_time_sheet_logs',
            'can_fetch_user_last_shift',
            'can_see_menu_item',
            'can_fetch_user_time_sheet_logs',
            'can_access_all_timesheets'
          ],
          role_id: custodianRoleRes.body.id
        });
        cy.factory('permission', {
          module: 'user',
          permissions: ['can_view_guests'],
          role_id: custodianRoleRes.body.id
        });
        cy.factory('store_custodian', {
          name: 'Mr Custodian',
          phone_number: '2348167740149',
          email: 'custodian@gmail.com',
          state: 'valid',
          community_id: commRes.body.id,
          role_id: custodianRoleRes.body.id
        });
      });
    });

    cy.login('2348167740149');
    cy.visit('/search');

    cy.get('.user-search-input')
      .type('A Guard')
      .type('{enter}');
    cy.wait(2000);
    cy.get('.user-search-result').click();
    cy.wait(1000);
    cy.get('#closeBtn').click();
    cy.get('.start-shift-btn').click();
    cy.wait(20000);
    cy.get('.end-shift-btn').click();

    cy.visit('/timesheet');

    cy.get('.shift-user-name').should('contain', 'A Guard');
  });
});
