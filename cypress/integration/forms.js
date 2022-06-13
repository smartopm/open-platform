describe('Custom Forms', () => {
  it('should submit a custom form', () => {
    cy.factory('community', { name: 'DoubleGDP' }).then(commRes => {
      cy.factory('role', {
        name: 'admin'
      }).then(roleRes => {
        cy.factory('permission', {
          module: 'forms',
          permissions: [
            'can_access_forms',
            'can_create_category',
            'can_create_form_user',
            'can_see_menu_item',
            'can_create_form',
            'can_create_form_properties',
            'can_fetch_form',
            'can_fetch_form_properties',
            'can_fetch_form_property',
            'can_fetch_form_categories'
          ],
          role_id: roleRes.body.id
        });
        cy.factory('permission', {
          module: 'community',
          permissions: ['can_see_menu_item'],
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

    // Login: Admin
    cy.login('2348167740149');

    // Go to Permits & Request Forms
    cy.get('.left-menu-collapsible').click();
    cy.wait(1000);
    cy.get('.community-menu-item').click();
    cy.wait(1000);
    cy.get('.permit-request-form-menu-item').click();
    cy.wait(1000);

    // The 'No Forms' text should be present initially
    cy.get('[data-testid=no-form-available]').should('contain', 'No Forms');

    // Create a new Form
    cy.get('.new-permit-request-form-btn').click();
    cy.wait(1000);
    cy.get('[data-testid=title]').type('Cypress Form');
    cy.get('[data-testid=description]').type('Simple Cypress Form');

    // Enable Form Preview
    cy.get('.form-previewbale-switch-btn').click();

    cy.get('[data-testid=submit]').click();
    cy.wait(2000);
    cy.get('[data-testid=cancel]').click();

    // The 'No Forms' text should disappear
    cy.get('[data-testid=no-form-available]').should('not.exist');

    // Add Category
    cy.get('.form-menu-open-btn').click();
    cy.wait(500);
    cy.get('.edit-form-btn').click();
    cy.wait(1000);
    cy.get('[data-testid=add_category]').click();
    cy.wait(1000);
    cy.get('.form-category-name-txt-input').type('Category 1');
    cy.get('.form-category-description-txt-input').type('Category 1 description');

    // Create rendered text for Form Preview
    cy.get('.form-category-rendered-txt-input').type(
      ' Previewing: TextField Value: #textfield, Checkbox Value: #checkbox'
    );
    cy.get('.form-category-header-visible-switch-btn').click();
    cy.get('[data-testid=custom-dialog-button]').click();
    cy.wait(2000);

    // Add Form Properties to Category
    cy.get('.form-category-add-field-btn').click();
    cy.wait(500);
    cy.addFormProperty('TextField', 'text', true);
    cy.addFormProperty('Radio', 'radio', false, ['Female', 'Male']);
    cy.addFormProperty('Dropdown', 'dropdown', false, ['CA', 'Lusaka']);
    cy.addFormProperty('Checkbox', 'checkbox', true, ['Red', 'Blue']);
    cy.addFormProperty('DateField', 'date', true);
    cy.addFormProperty('TimeField', 'time', false);
    cy.addFormProperty('DateTimeField', 'datetime', false);

    /** Submit a Form * */
    cy.get('.permit-request-form-menu-item').click();
    cy.wait(500);
    cy.get('.left-menu-collapsible').click();
    cy.wait(500);
    cy.contains('Cypress Form').click();
    cy.wait(2000);

    // Trigger Validation
    cy.get('[data-testid=submit_form_btn]').click();
    cy.wait(1000);
    cy.get('[data-testid=confirm_contract]').click();
    cy.contains('Close').click({force: true});

    // Fields Should be Required, Form submit terminated
    cy.contains('Required').should('exist');
    cy.wait(1000);

    // Fill the Form
    cy.get('.form-txt-input-property-TextField').type('12345');
    cy.get('[type="radio"]')
      .first()
      .check();
    cy.get('.form-txt-input-property-Dropdown').click();
    cy.get(`[data-value=Lusaka]`).click();
    cy.get('[type="checkbox"]')
      .first()
      .check();
    cy.get('[data-testid=date-picker]').click()
    cy.get('.MuiPickersDay-today').click()
    cy.contains('Ok').click();

    cy.get('[data-testid=time_picker]').click();
    cy.contains('Ok').click();
    cy.wait(1000);

    // Click Submit
    cy.get('[data-testid=submit_form_btn]').click();
    cy.wait(2000);

    // Check For Contract Preview
    cy.contains('Contract Preview').should('exist');
    cy.wait(1000);
    cy.contains('Previewing: TextField Value: 12345, Checkbox Value: Red').should('exist');
    cy.wait(1000);
    cy.get('[data-testid=confirm_contract]').should('exist');
    cy.wait(1000);

    // Click Confirm Preview
    cy.get('[data-testid=confirm_contract]').click();
    cy.wait(3000);

    // Check if form was submitted successfully with a reload
    cy.get('.form-txt-input-property-TextField').should('not.have.value', '12345');
    cy.wait(1000);
  });
});
