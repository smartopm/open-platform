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
              'can_create_note',
              'can_see_menu_item',
              'can_update_note',
              'can_set_note_reminder',
              'can_assign_note',
              'can_bulk_assign_note',
              'can_create_note_comment',
              'can_update_note_comment',
              'can_delete_note_comment',
              'can_fetch_flagged_notes',
              'can_fetch_task_by_id',
              'can_fetch_task_comments',
              'can_fetch_task_histories',
              'can_get_task_count',
              'can_get_task_stats',
              'can_get_own_tasks',
              'can_fetch_all_notes',
              'can_fetch_user_notes',
              'can_view_create_task_button',
              'can_view_create_sub_task_button',
              'can_access_tasks',
              'can_access_processes',
              'can_delete_note_document',
              'can_resolve_note_comments'
            ],
            role_id: adminRes.body.id,
          })
          cy.factory('permission', {
            module: 'community',
            permissions: ['can_see_menu_item'],
            role_id: adminRes.body.id,
          })
          cy.factory('permission', {
            module: 'user',
            permissions: ['can_get_users_lite'],
            role_id: adminRes.body.id,
          })
          cy.factory('admin_user', {
            name: 'Admin User',
            phone_number: '2348167740149',
            email: 'admin@email.com',
            state: 'valid',
            user_type: 'admin',
            community_id: commRes.body.id,
            role_id: adminRes.body.id
          })
        })
      })

      cy.login('2348167740149');
      cy.visitSubMenu('.community-menu-item', '.tasks-menu-item');
    });

    it('renders tasks page successfully', () => {
      // Top elements
      cy.get('[data-testid=todo-container]').should('be.visible');
      cy.get('[data-testid=task-quick-search]').should('be.visible');
      cy.get('[data-testid=search]').should('be.visible');
      cy.get('[data-testid=create_task_btn]').should('be.visible');

      // Creating a task
      cy.get('[data-testid=create_task_btn]').click();
      cy.contains('Create a task');

      // Fill the task form
      cy.get('[data-testid=task-body]').type('Cypress test task');
      cy.get('[data-testid=task-description]').type('Cypress test task description');
      cy.get('[data-testid=task-type]').type('To-Do{enter}');
      cy.get('[data-testid=auto-complete-input]').type('Admin User');
      cy.contains('Admin User').click();

      // Submit
      cy.get('[data-testid=task-submit-button]').click();

      // Go to my tasks
      cy.visit('/tasks');
      cy.contains('Cypress test task');

      // Go to open tasks
      cy.visit('/tasks?filter=tasksOpen');
      cy.contains('Cypress test task');
    });
  });
});
