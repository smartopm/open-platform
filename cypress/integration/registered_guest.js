/* eslint-disable no-undef */

describe('Registered Guests', () => {
  it('grants access to a scheduled registered guest', () => {
    cy.factory('community', { name: 'Nkwashi' }).then((communityResponse) => {
      cy.factory('admin_user', {
        name: 'Larry Bird',
        phone_number: '2348167740149',
        email: 'larrybird@gmail.com',
        state: 'valid',
        community_id: communityResponse.body.id,
      })
      
      cy.factory('security_guard', {
        name: 'A Guard',
        phone_number: '2347065834175',
        email: 'guard.dgdp@gmail.com',
        state: 'valid',
        community_id: communityResponse.body.id,
      })

      cy.factory('resident', {
        name: 'John Doe',
        phone_number: '2348034566432',
        email: 'johndoe@gmail.com',
        state: 'valid',
        community_id: communityResponse.body.id,
      })
    })

    // Login in as Admin user
    cy.login('2348167740149')

    // Go to Registered Guests page
    cy.visitMainMenu('.logbook-menu-item', '.logbook-parent-menu-item')
    cy.contains('Registered Guests').click();
    cy.wait(1000)
    
    // No Invited guests initially
    cy.get('[data-testid=no-invited-guests-available]').should('exist');
    cy.contains('New Invite').click();
    cy.wait(1000)
    
    // Trigger validation
    cy.get('[data-testid=submit_button]').click();
    cy.contains('Required').should('exist');
    cy.wait(1000)
    
    cy.get('[data-testid=entry_user_name]').type('Guest User')
    cy.get('[data-testid=entry_user_nrc]').type('0U2J0J239')
    cy.get('[data-testid=entry_user_phone]').type('0024067740149')
    cy.get('[data-testid=entry_user_vehicle]').type('AQW2714')
    cy.get('[data-testid=companyName]').type('Company 1')
    cy.get('.visiting_reason').click()
    cy.get('[data-value=client]').click();
    
    // Choose a valid visitation date & time
    cy.get('[data-testid=day_of_visit_input]').type(Cypress.moment().format('YYYY, MM DD'))
    cy.get('[data-testid=start_time_input]').click()
    cy.contains('Ok').click();
    
    // Accommodate different time periods to make invite valid
    cy.get('[data-testid=end_time_input]').click()
    new Date().getHours() <= 12 ? cy.contains('PM').click() :  cy.get('.MuiPickersClock-squareMask').click()
    cy.contains('Ok').click();
    cy.wait(1000)
    
    // Submit
    cy.get('[data-testid=submit_button]').click();
    cy.wait(2000)
    
    // Confirm QRCode section to enter email
    cy.get('.qrcode-enter-email-text').should('exist');
    cy.get('[data-testid=guest-email-input]').should('exist');

    // Skip QRCode sending
    cy.get('[data-testid=dont-send-confirmation]').click();
    cy.wait(2000)
    
    // Verify registered guests record was created
    cy.get('[data-testid=no-invited-guests-available]').should('not.exist');
    cy.get('[data-testid=guest_name]').should('contain', 'Guest User');
    cy.get('[data-testid=start_of_visit]').should('exist');
    cy.get('[data-testid=end_of_visit]').should('exist');
    cy.get('[data-testid=access_time]').should('exist');
    cy.get('[data-testid=validity]').should('exist');
    cy.get('[data-testid=access_actions]').should('exist');
    cy.get('[data-testid=grant_access_btn]').should('not.be.disabled');
    cy.contains('Valid').should('exist');
    
    // Log out as admin
    cy.logout()
    // Log In as Security Guard to grant access
    cy.login('2347065834175')
    cy.visitMainMenu('.logbook-menu-item', '.logbook-parent-menu-item')
    
    // No initial access granted to registered guest
    cy.get('[data-testid=visitor_name]').should('not.exist');
    cy.get('[data-testid=access_status]').should('not.exist');
    cy.wait(1000)
    
    // Go to Registered Guests page
    cy.contains('Registered Guests').click();
    cy.wait(1000)
    cy.get('[data-testid=guest_name]').should('contain', 'Guest User');
    cy.get('[data-testid=grant_access_btn]').should('not.be.disabled');
    
    // Click grant access
    cy.get('[data-testid=grant_access_btn]').click();
    cy.wait(1000)
    
    // Confirm Observation Dialog shows up
    cy.get('[data-testid=entry-dialog-title]').should('exist');
    cy.get('[data-testid=entry-dialog-field]').type('Guest User Observation');
    cy.get('[data-testid=save]').click();
    cy.wait(2000)
    
    cy.contains('All Visits').click();
    cy.wait(1000)
    
    // Verify access was granted successfully
    cy.get('[data-testid=visitor_name]').should('contain', 'Guest User');
    cy.get('[data-testid=acting_user]').should('contain', 'Larry Bird');
    cy.get('[data-testid=access_status]').should('contain', 'Granted');
  });

  it('does not grant access to invalid registered guest invite ', () => {
    // Log In as Resident
    cy.login('2348034566432')

    // Go Guest List page
    cy.visitMainMenu('.guest-list-menu-item', '.logbook-parent-menu-item')
    cy.wait(1000)

    // No Invited guests initially
    cy.get('[data-testid=no-invited-guests-available]').should('exist');
    cy.contains('New Guest').click();
    cy.wait(1000)
    
    cy.get('[data-testid=entry_user_name]').type('Guest User 2')
    cy.get('[data-testid=email]').type('email@test.com')
    cy.get('[data-testid=entry_user_nrc]').type('0U2J0J239')
    cy.get('[data-testid=entry_user_phone]').type('0024067740149')
    cy.get('[data-testid=entry_user_vehicle]').type('AQW2714')
    cy.get('[data-testid=companyName]').type('Company 2')
    cy.get('.visiting_reason').click()
    cy.get('[data-value=other]').click();
    cy.get('[data-testid=other_reason_business]').type('Other Reason');
    cy.contains('Save').click()

    // Make invite invalid
    // A date in the past
    cy.get('[data-testid=day_of_visit_input]').type(Cypress.moment('2015-02-01').format('YYYY, MM DD'))
    cy.get('[data-testid=start_time_input]').click()
    cy.contains('Ok').click();
    cy.get('[data-testid=end_time_input]').click()
    cy.contains('Ok').click();

    // Submit
    cy.get('[data-testid=submit_button]').click();
    cy.wait(2000)
    
    // Confirm QRCode section to enter email
    cy.get('.confirm-send-qrcode').should('exist');
    cy.get('[data-testid=guest-email]').should('contain', 'email@test.com');

    // Skip QRCode sending
    cy.get('[data-testid=dont-send-confirmation]').click();
    cy.wait(2000)
    
    // Verify guest was added
    cy.get('[data-testid=no-invited-guests-available]').should('not.exist');
    cy.get('[data-testid=guest_name]').should('contain', 'Guest User 2');
    cy.contains('Invalid').should('exist');
    cy.get('[data-testid=start_of_visit]').should('exist');
    cy.get('[data-testid=end_of_visit]').should('exist');
    cy.wait(1000)

    // Log out as Resident
    cy.logout()
    // Log In as Security Guard to grant access
    cy.login('2347065834175')
    cy.visitMainMenu('.logbook-menu-item', '.logbook-parent-menu-item')
    
    // No initial access granted to registered guest
    cy.get('[data-testid=visitor_name]').should('not.contain', 'Guest User 2');
    // cy.get('[data-testid=access_status]').should('not.exist');
    cy.wait(1000)
    
    // Go to Registered Guests page
    cy.contains('Registered Guests').click();
    cy.wait(1000)
    cy.get('[data-testid=guest_name]').should('contain', 'Guest User 2');

    // Cannot grant access to invalid invite
    cy.get('[data-testid=grant_access_btn]').should('be.disabled');
    cy.wait(1000)
  });

});
