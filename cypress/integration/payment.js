/* eslint-disable no-undef */

describe('Payment', () => {
  it('records a new payment successfully', () => {
    cy.factory('community', { name: 'Nkwashi' }).then(commRes => {
      cy.factory('admin_user', {
        name: 'An Admin User',
        phone_number: '2348167740149',
        email: 'adminuser@gmail.com',
        state: 'valid',
        community_id: commRes.body.id
      }).then(userRes => {
        cy.factory('account', { user_id: userRes.body.id, community_id: commRes.body.id }).then(
          accountRes => {
            cy.factory('land_parcel', {
              parcel_number: '1000001',
              community_id: commRes.body.id
            }).then(parcelRes => {
              cy.factory('land_parcel_account', {
                land_parcel_id: parcelRes.body.id,
                account_id: accountRes.body.id
              });
            });
          }
        );
      });
    });

    // Login: Admin
    cy.login('2348167740149');

    // Go to user's page
    cy.get('.left-menu-collapsible').click();
    cy.wait(1000);
    cy.get('.my-profile-menu-item').click();
    cy.wait(1000);
    cy.get('.right-menu-drawer').click();
    cy.wait(1000);
    cy.get('.right-menu-payment-item').click();
    cy.wait(1000);

    // The 'no plan available' text should be present initially
    cy.get('[data-testid=no-plan-available]').should('contain', 'No Plan Available');

    // Create a payment plan first
    cy.get('.new-payment-plan-btn').click();
    cy.wait(1000);
    cy.get('.plan-duration-txt-input').type(12);
    cy.get('.plan-amount-txt-input').type(500);
    cy.get('.plan-type-select-input').click();
    cy.get('[data-value=basic]').click();
    cy.get('.plan-plot-select-input').click();
    cy.get("[data-value='[object Object]']").click();
    cy.get('[data-testid=custom-dialog-button]').click();
    cy.wait(2000);

    // The 'no plan available' text should disappear
    cy.get('[data-testid=no-plan-available]').should('not.exist');

    // The plan table should have these info
    cy.get('[data-testid=plot-number]').should('contain', '1000001');
    cy.get('[data-testid=payment-plan]').should('contain', 'Basic');
    cy.get('[data-testid=balance]').should('contain', 'K 6000');

    // Now make a payment
    cy.get('.record-new-payment-btn').click();
    cy.wait(2000);
    cy.get('.transaction-type-select-input').click();
    cy.get('[data-value=cash]').click();
    cy.get('.transaction-number-input').type('12345678');
    cy.get('.transaction-amount-input').type(2000);
    cy.get('[data-testid=custom-dialog-button]').click();
    cy.wait(1000);
    cy.get('[data-testid=custom-dialog-button]').click();
    cy.wait(1000);
    cy.get('[data-testid=print]').click();

    // Verify receipt info
    cy.get('[data-testid=client-name]').should('contain', 'An Admin User');
    cy.get('[data-testid=cashier-name]').should('contain', 'An Admin User');
    cy.get('[data-testid=total-amount-paid]').should('contain', 'K 2000');
    cy.get('[data-testid=expected-monthly-amount]').should('contain', 'K 500');

    cy.get('.close-receipt-details').click();
    cy.wait(1000);
    cy.get('[data-testid=summary]').click();
    cy.wait(1000);

    // Verify transaction table
    cy.get('[data-testid=payment-type]').should('contain', 'cash');
    cy.get('[data-testid=amount]').should('contain', 'K 2000');
    cy.get('.custom-label').should('contain', 'Paid');
  });
});