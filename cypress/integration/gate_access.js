describe('Gate Access', () => {
  it('allows security guards to record entry logs', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(commRes => {
      cy.factory('role', {
        name: 'security_guard'
      }).then(guardRes => {
        cy.factory('permission', {
          module: 'entry_request',
          permissions: ['can_access_logbook', 'can_see_menu_item', 'can_search_guests'],
          role_id: guardRes.body.id
        });
        cy.factory('permission', {
          module: 'user',
          permissions: ['can_view_guests'],
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
        name: 'admin'
      }).then(roleRes => {
        cy.factory('permission', {
          module: 'entry_request',
          permissions: ['can_access_logbook', 'can_see_menu_item', 'can_search_guests'],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'gate_access',
          permissions: ['can_see_menu_item'],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'user',
          permissions: ['can_view_guests'],
          role_id: roleRes.body.id
        });
        cy.factory('admin_user', {
          name: 'An Admin User',
          phone_number: '2348167740149',
          email: 'adminuser@gmail.com',
          state: 'valid',
          community_id: commRes.body.id,
          role_id: roleRes.body.id
        });
      });
    });

    // Login: Security Guard
    cy.login('2347065834175');
    cy.visit('/search');

    cy.get('.user-search-input')
      .type('An Admin User')
      .type('{enter}');
    cy.wait(2000);
    cy.get('.user-search-result').click();
    cy.wait(1000);

    // Refresh the page with current timestamp in the url to immitate scanning
    cy.fetchUser('2348167740149').then(response => {
      cy.visit(`/user/${response.body.id}/${Date.now()}/dg`);
      cy.wait(1000);
    });

    cy.get('#closeBtn').click();
    cy.get('.log-entry-btn').click();
    cy.wait(1000);
    cy.visit('/logout');

    // Login: Admin
    cy.login('2348167740149');
    cy.visit('/logbook');
    cy.get('.entry-log-visitor-name').should('contain', 'An Admin User');
  });
});
