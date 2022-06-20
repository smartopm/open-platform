# frozen_string_literal: true

namespace :db do
  desc 'Associate note list to note'
  task associate_note_list_to_note: :environment do
    Community.find_each do |community|
      community.notes.where(note_list_id: nil, category: 'form').find_each do |note|
        form = note.form_user&.form
        next if form&.process.nil?

        note.update!(note_list_id: form.process.note_list&.id)

        note.sub_tasks.each do |sub_task|
          sub_task.update!(note_list_id: note.note_list_id)

          sub_task.sub_tasks.each do |sub_sub_task|
            sub_sub_task.update!(note_list_id: note.note_list_id)
          end
        end
      end
    end
    puts 'Successfully associated notes with note list'
  rescue StandardError => e
    puts 'Failed to assoicate notes with note list'
    puts e.message.to_s
  end
end
