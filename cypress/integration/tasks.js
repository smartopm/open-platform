describe('Tasks page', () => {
  describe('Admin role', () => {
    before(() => {
      cy.factory('community', { name: 'Nkwashi' }).then((commRes) => {
        cy.factory('role', {
          name: 'admin',
        }).then((adminRes) => {
          cy.factory('permission', {
            module: 'note',
            permissions: [
              'can_see_menu_item',
              'can_access_tasks',
              'can_update_note',
              'can_view_create_task_button',
              'can_create_note'
            ],
            role_id: adminRes.body.id,
          })
          cy.factory('permission', {
            module: 'community',
            permissions: ['can_see_menu_item'],
            role_id: adminRes.body.id,
          })
          cy.factory('admin_user', {
            name: 'Admin User',
            phone_number: '2348167740149',
            email: 'admin@email.com',
            state: 'valid',
            community_id: commRes.body.id,
            role_id: adminRes.body.id
          })
        })
      })

      cy.login('2348167740149');
      cy.visitSubMenu('.community-menu-item', '.tasks-menu-item');
    });

    it('creates a task successfully', () => {
      cy.get('[data-testid=create_task_btn]').click()
    });
  });
});
