class CreateActionFlows < ActiveRecord::Migration[6.0]
  def change
    create_table :action_flows, id: :uuid do |t|
      t.string :title
      t.string :description
      t.string :event_type
      t.string :event_condition
      t.json :event_action
      t.boolean :active, default: false

      t.timestamps
    end

    [{
      'title' => 'Email To Assignees On Task Update',
      'description' => 'Email On task update',
      'event_type' => 'task_update',
      'event_condition' => '{"==":[1,1]}',
      'event_action' => {
        'action_name' => 'email',
        'action_fields' => {
          'email' => {
            'name' => 'email',
            'value' => 'note_assignees_emails',
            'type' => 'variable',
          }, 'template' => {
            'name' => 'template',
            'value' => 'd-285b8ab4099b424a93fc04be801a87db',
            'type' => 'string',
          }, 'url' => {
            'name' => 'url',
            'value' => 'note_url',
            'type' => 'variable',
          }, 'body' => {
            'name' => 'body',
            'value' => 'note_body',
            'type' => 'variable',
          }
        },
      },
    },
    {
      'title' => 'Email To Assignees On Note Comment Update',
      'description' => 'Email On comment update',
      'event_type' => 'note_comment_update',
      'event_condition' => '{"==":[1,1]}',
      'event_action' => {
        'action_name' => 'email',
        'action_fields' => {
          'email' => {
            'name' => 'email',
            'value' => 'note_comment_assignees_emails',
            'type' => 'variable',
          }, 'template' => {
            'name' => 'template',
            'value' => 'd-285b8ab4099b424a93fc04be801a87db',
            'type' => 'string',
          }, 'url' => {
            'name' => 'url',
            'value' => 'note_comment_url',
            'type' => 'variable',
          }, 'body' => {
            'name' => 'body',
            'value' => 'note_comment_body',
            'type' => 'variable',
          }
        },
      },
    },
     {
       'title' => 'Email To Assignees On Note Comment Create',
       'description' => 'Email On comment create',
       'event_type' => 'note_comment_create',
       'event_condition' => '{"==":[1,1]}',
       'event_action' => {
         'action_name' => 'email',
         'action_fields' => {
           'email' => {
             'name' => 'email',
             'value' => 'note_comment_assignees_emails',
             'type' => 'variable',
           }, 'template' => {
             'name' => 'template',
             'value' => 'd-285b8ab4099b424a93fc04be801a87db',
             'type' => 'string',
           }, 'url' => {
             'name' => 'url',
             'value' => 'note_comment_url',
             'type' => 'variable',
           }, 'body' => {
             'name' => 'body',
             'value' => 'note_comment_body',
             'type' => 'variable',
           }
         },
       },
     }].each do |f|
      ActionFlow.create!(
        title: f['title'],
        description: f['description'],
        event_type: f['event_type'],
        event_condition: f['event_condition'],
        event_action: f['event_action'],
        active: true
      )
     end
  end
end
