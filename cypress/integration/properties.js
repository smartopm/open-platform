/**
 * Creat 2 users
 * Login in as user1
 * Go to Properties
 * No property available should exist
 * Click create new Property
 * Add user1 and user2 as owners
 * Save
 * Property should exist
 * Go to user 1 profile -> Go to payments tab
 * Pending balance should be 0 for user 1
 * No payment plan available for user 2
 * Click new payment plan button
 * Choose the co-owned plot
 * Choose user 2 as co-owner
 * Save
 * Go to user payments page
 * Pending balance should change
 * Go to Users page
 * Select user2 -  Go to their profile
 * Open Payments
 * Payment plan should exist
 * No Pending balance should exist
 * Click view details
 * Co-owners section should contain user 2
 */

describe('Properties & Co-ownership Payment Plan', () => {
  it('creates a co-owned property and a payment plan ', () => {
    // Create 2 users
    cy.factory('community', { name: 'Nkwashi' }).then((communityResponse) => {
      cy.factory('admin_user', {
        name: 'Larry Bird',
        phone_number: '2348167740149',
        email: 'larrybird@gmail.com',
        state: 'valid',
        community_id: communityResponse.body.id,
      })

      cy.factory('admin_user', {
        name: 'John Doe',
        phone_number: '2348064014977',
        email: 'johndoe@gmail.com',
        state: 'valid',
        community_id: communityResponse.body.id,
      })
    })

    // Login in as User 1
    cy.login('2348167740149')

    // Go to Properties page
    cy.visitMainMenu('.properties-menu-item')

     // The 'No Property' text should be present initially
    //  cy.get('[data-testid=no-form-available]').should('contain', 'No Forms');
    
    // Create New Property
    cy.get('.new-property-btn').click();
    cy.wait(1000);

    

  });
});