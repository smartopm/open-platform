describe('Tasks page', () => {
  describe('Admin role', () => {
    before(() => {
      cy.factory('community', { name: 'DoubleGDP' }).then((commRes) => {
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
      cy.get('.left-menu-collapsible').click();
      cy.get('.community-menu-item').click();
      cy.get('.tasks-menu-item').click();
      cy.get('.tasks-sub-menu-item').click();
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

      // Filter by 'My Tasks'
      cy.visit('/tasks');
      cy.contains('Cypress test task');

      // Filter by open tasks
      cy.visit('/tasks?filter=tasksOpen');
      cy.contains('Cypress test task');

      // Open task details split view
      cy.get('[data-testid=task-item-menu]').click();
      cy.contains('Open Task Details').click();
      cy.get('[data-testid=drawer]').should('be.visible');

      // Close task details split view
      cy.get('[data-testid=close-drawer-button]').click({ force: true });
      cy.get('[data-testid=task-info-section]').should('not.be.visible');

      // Add Sub Task
      cy.visit('/tasks?filter=tasksOpen');
      cy.get('[data-testid=task-item-menu]').click();
      cy.contains('Add Sub Task').click();
      cy.contains('Create a task');

      cy.get('[data-testid=task-body]').type('Cypress test sub task');
      cy.get('[data-testid=task-description]').type('Cypress test sub task description');
      cy.get('[data-testid=task-type]').type('To-Do{enter}');
      cy.get('[data-testid=task-submit-button]').click();

      cy.visit('/tasks?filter=tasksOpen');
      cy.contains('Cypress test task');
      cy.get('[data-testid=show_task_subtasks]').click();
      cy.contains('Cypress test sub task');

      // Upload a document
      cy.visit('/tasks');
      cy.contains('Cypress test task');
      cy.get('[data-testid=task-item-menu]').click();
      cy.get('input[type="file"]').attachFile('test_image.png');

      // Leave a comment
      cy.visit('/tasks');
      cy.contains('Cypress test task');
      cy.get('[data-testid=task-item-menu]').click();
      cy.contains('Leave a comment').click();
      cy.get('[data-testid=body_input]').type('This is a test comment', {force: true});
      cy.get('[data-testid=comment_btn]').click();
      cy.get('[data-testid=comment-body]').contains('This is a test comment');

      // Set reminder
      cy.get('[data-testid=drawer-paper]').scrollTo('top');
      cy.get('[data-testid=alarm]').click();
      cy.contains('Remind Me in 1 hour').click();
      cy.wait(1000);
      cy.get('[data-testid=task-info-section]').contains('None').should('not.exist');

      // Mark as complete
      cy.visit('/tasks');
      cy.contains('Cypress test task');
      cy.get('[data-testid=task_completion_toggle_button]').click();
      cy.contains('Cypress test task').should('not.exist');
      cy.visit('tasks?filter=completedTasks');
      cy.contains('Cypress test task');
    });
  });
});
