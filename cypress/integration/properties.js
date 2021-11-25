// /* eslint-disable no-undef */

// describe('Properties & Co-ownership Payment Plan', () => {
//   it('creates a co-owned property and a payment plan ', () => {
//     // Create 2 users
//     cy.factory('community', { name: 'Nkwashi' }).then((communityResponse) => {
//       cy.factory('admin_user', {
//         name: 'Larry Bird',
//         phone_number: '2348167740149',
//         email: 'larrybird@gmail.com',
//         state: 'valid',
//         community_id: communityResponse.body.id,
//       })

//       cy.factory('admin_user', {
//         name: 'John Doe',
//         phone_number: '2348064014977',
//         email: 'johndoe@gmail.com',
//         state: 'valid',
//         community_id: communityResponse.body.id,
//       })
//     })

//     // Login in as User 1
//     cy.login('2348167740149')

//     // Go to Properties page
//     cy.visitMainMenu('.properties-menu-item')

//      // Property List should not contain our proposed property initially
//     cy.contains('Co-owned Plot').should('not.exist');
    
//     // Create New Property
//     cy.get('.new-property-btn').click();
//     cy.wait(1000);
//     cy.contains('New Property').should('exist');
//     cy.wait(1000);
//     cy.get('.property-parcel-number-txt-input').type('Co-owned Plot');
//     cy.get('.property-parcel-type-txt-input').type('basic');
//     cy.wait(1000);

//     // Add user 1 as primary Owner
//     cy.contains('Ownership').click();
//     cy.wait(1000);
//     cy.contains('New Owner').click();
//     cy.wait(1000);    
//     cy.get('.property-owner-name-txt-input-0').type('Larry Bird');
//     cy.wait(1000);
//     cy.contains('Larry Bird').click();
//     cy.wait(1000);
//     cy.get('.property-owner-address-txt-input-0').type('Larry Bird Address');
//     cy.contains('Save').click();
//     cy.wait(2000);
    
//     cy.contains('Co-owned Plot').should('exist');
    
//     // Edit Property
//     cy.get('[data-testid=edit_property_menu]').click();
//     cy.wait(1000);
//     cy.contains('Edit Property').click();
//     cy.wait(1000);

//     // Add User 2 as co-owner
//     cy.contains('Ownership').click();
//     cy.wait(1000);
//     cy.get('[data-testid=custom-dialog-button]').click();
//     cy.wait(1000);
//     cy.contains('New Owner').click();
//     cy.wait(1000);    
//     cy.get('.property-owner-name-txt-input-1').type('John Doe');
//     cy.wait(1000);
//     cy.contains('John Doe').click();
//     cy.wait(1000);
//     cy.get('.property-owner-address-txt-input-1').type('John Doe Address');
//     cy.contains('Save changes').click();
//     cy.wait(2000);
    
//     // Verify User 2 does not have payment plan initially
//     cy.visitUserProfile('John Doe');
//     cy.visitUserMenu('.right-menu-payment-item');
    
//     // User 2 has no payment plan initially
//     cy.contains('Total Balance').should('not.exist');
//     cy.get('[data-testid=no-plan-available]').should('contain', 'No Plan Available');
//     cy.get('[data-testid=no-plan-available]').click();
    
//     // Add Payment plan under Primary Owner (User 1)
//     cy.myProfile()
//     cy.visitUserMenu('.right-menu-payment-item');
//     cy.addNewPaymentPlanFromUserProfile({
//       duration: 12,
//       amount: 500,
//       type: 'basic',
//       plot: 'Land: Co-owned Plot',
//       coOwner: 'John Doe'
//     })
    
//     // Verify Pending Balance & Payment plan is updated for Primary Owner  (User 1)
//     cy.get('[data-testid=no-plan-available]').should('not.exist');
//     cy.contains('Total Balance').should('exist');
//     cy.contains('- K 6000').should('exist');
    
//     // Verify Pending balance & payment plan for Co-owner (User 2) 
//     cy.visitUserProfile('John Doe');
//     cy.visitUserMenu('.right-menu-payment-item');
//     cy.get('[data-testid=no-plan-available]').should('not.exist');
//     cy.wait(1000);
    
//     // Pending balance should be attached to primary owner
//     cy.contains('Total Balance').should('not.exist');
//     cy.contains('- K 6000').should('not.exist');
    
//     // User 2 should be listed as co-owner in payment plan
//     cy.get('[data-testid=plan-menu]').click();
//     cy.wait(1000);
//     cy.contains('View Details').click();
//     cy.wait(1000);
//     cy.get('.plan-detail-co-owner').click();
//     cy.get('.plan-detail-co-owner').should('contain', 'John Doe');
//     cy.wait(2000);

//   });
// });