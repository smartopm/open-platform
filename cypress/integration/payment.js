describe('Payment', () => {
  it('records a new payment successfully', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(commRes => {
      cy.factory('role', {
        name: 'admin'
      }).then(roleRes => {
        cy.factory('permission', {
          module: 'profile',
          permissions: ['can_see_menu_item'],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'payment_plan',
          permissions: ['can_view_menu_list', 'can_create_payment_plan'],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'plan_payment',
          permissions: [
            'can_see_menu_item',
            'can_access_all_payments',
            'can_create_plan_payment',
            'can_fetch_payments_list'
          ],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'transaction_plan',
          permissions: ['can_create_transaction', 'can_fetch_user_transactions'],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'land_parcel',
          permissions: ['can_fetch_land_parcels_with_plans'],
          role_id: roleRes.body.id
        });

        cy.factory('admin_user', {
          name: 'An Admin User',
          phone_number: '2348167740149',
          email: 'adminuser@gmail.com',
          state: 'valid',
          role_id: roleRes.body.id,
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
    });
    // Login: Admin
    cy.login('2348167740149');

    // Go to user's page
    cy.visitMainMenu('.my-profile-menu-item');
    cy.get('.option_menu_toggler').click();
    cy.wait(1000);
    cy.get('#payments').click();
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
    cy.get('[data-testid=balance]').should('contain', '6,000');

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
    cy.get('[data-testid=total-amount-paid]').should('contain', '2,000');
    cy.get('[data-testid=expected-monthly-amount]').should('contain', '500');

    cy.get('.close-receipt-details').click();
    cy.wait(1000);
    cy.get('[data-testid=summary]').click();
    cy.wait(1000);

    // Verify transaction table
    cy.get('[data-testid=payment-type]').should('contain', 'cash');
    cy.get('[data-testid=amount]').should('contain', '2,000');
    cy.get('.custom-label').should('contain', 'Paid');
  });
});
