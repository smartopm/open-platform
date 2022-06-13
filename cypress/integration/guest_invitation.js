describe('Gate Access', () => {
  it('allows residents to invite guests', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(community => {
      cy.factory('role', {
        name: 'resident'
      }).then(residentRole => {
        cy.factory('permission', {
          module: 'entry_request',
          permissions: [
            'can_access_logbook',
            'can_see_menu_item',
            'can_invite_guest',
            'can_access_guest_list',
            'can_update_invitation'
          ],
          role_id: residentRole.body.id
        });
        cy.factory('permission', {
          module: 'user',
          permissions: ['can_view_guests', 'can_search_guests'],
          role_id: residentRole.body.id
        });
        cy.factory('permission', {
          module: 'gate_access',
          permissions: ['can_see_menu_item'],
          role_id: residentRole.body.id
        });
        cy.factory('permission', {
          module: 'guest_list',
          permissions: ['can_see_menu_item'],
          role_id: residentRole.body.id
        });
        cy.factory('resident', {
          name: 'Mr Resident',
          phone_number: '2347065834175',
          email: 'adminuser@gmail.com',
          community_id: community.body.id,
          role_id: residentRole.body.id
        });
        cy.factory('user_with_community', {
          name: 'Joe doe',
          phone_number: '23000834175',
          email: 'visitor@gmail.com',
          community_id: community.body.id
        });
      });
    });

    // Login: as a resident
    cy.login('2347065834175');

    cy.visitSubMenu('.logbook-menu-item', '.guest-list-sub-menu-item');
    cy.get('[aria-label=SpeedDial]').click();
    cy.wait(1000);

    cy.get('[data-testid=date-picker]').eq(0).click()
    cy.get('.MuiPickersDay-today').click()
    cy.contains('Ok').click();
    cy.wait(1000);

    cy.get('[data-testid=time_picker]').eq(0).click();
    cy.contains('Ok').click();
    cy.wait(1000);

    cy.get('[data-testid=time_picker]')
      .eq(1)
      .click();
    cy.contains('Ok').click();
    cy.wait(500);

    // Find an existing visitor
    cy.get('[data-testid=search]')
      .type('Joe doe')
      .type('{enter}');
    cy.wait(2000);
    cy.contains('Joe doe').should('exist');
    cy.get('[data-testid=invite_guest_btn]').click();

    // Add a new visitor who doesn't exist yet
    cy.get('[data-testid=search]')
      .type('Mary dinna')
      .type('{enter}');
    cy.wait(2000);
    cy.contains('User Not Found - Please Add New Guest').should('exist');
    cy.get('[data-testid=guest_entry_first_name]').type('Mary');
    cy.wait(500);
    cy.get('[data-testid=guest_entry_last_name]').type('dinna');
    cy.wait(500);
    cy.get('[data-testid=guest_entry_phone_number]').type('010203040506');
    cy.get('[data-testid=add_remove_guest_btn]').click();

    // invite a company
    cy.get('[data-testid=company_mode]').click();
    cy.get('[data-testid=company_name]').type('General Traders co. Ltd');
    cy.get('[data-testid=guest_entry_phone_number]')
      .eq(0)
      .type('00103040606');
    cy.get('[data-testid=add_remove_guest_btn]')
      .eq(0)
      .click();

    cy.get('[data-testid=invite_button]').click();
    cy.wait(2000);

    cy.contains('Mary dinna').should('exist');
    cy.contains('Joe doe').should('exist');
    cy.contains('General Traders co. Ltd').should('exist');

    // Edit guest's date and time
    cy.get('[data-testid=guest_invite_menu]').eq(0).click();
    cy.wait(200);
    cy.get('[data-testid=menu_item]').eq(0).click();
    cy.wait(1000);
    cy.contains('Edit Guest').should('exist');
    cy.contains('Cancel').should('exist');
    cy.contains('Update Guest').should('exist');

    cy.get('[data-testid=date-picker]').eq(0).click()
    cy.get('.MuiPickersDay-today').click()
    cy.contains('Ok').click();
    cy.wait(500);

    cy.get('[data-testid=time_picker]').eq(0).click();
    cy.contains('Ok').click();
    cy.wait(500);

    cy.get('[data-testid=time_picker]').eq(1).click();
    cy.contains('Ok').click();
    cy.wait(500);

    cy.get('[data-testid=week_days]').eq(0).click();
    cy.get('[data-testid=week_days]').eq(1).click();
    cy.wait(200);
    cy.contains('Repeats Until').should('exist');

    cy.get('[data-testid=date-picker]').eq(1).click();
    cy.get('.MuiPickersDay-today').click();
    cy.contains('Ok').click();
    cy.wait(500);

    cy.get('[data-testid=update_button]').click();
    cy.wait(2000);
    cy.get('.MuiDialog-paperScrollPaper').should('not.exist');

    // Cancel an invitation
    cy.get('[data-testid=guest_invite_menu]')
      .eq(0)
      .click();
    cy.wait(200);
    cy.get('[data-testid=menu_item]')
      .eq(1)
      .click();
    cy.wait(2000);
    cy.contains('Cancelled').should('exist');
  });
});
