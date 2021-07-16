# frozen_string_literal: true

desc 'Update form entries url of notes which are associated with form user'
task update_form_entry_url_of_notes: :environment do
  Forms::FormUser.all.each do |form_user|
    hostname = form_user.note.body.split('<a href="https://')[1].split('/user')[0]
    note = form_user.note
    user = form_user.user

    note.body = "<a href=\"https://#{hostname}/user/#{user.id}\">#{user.name}</a> Submitted
    <a href=\"https://#{hostname}/user_form/#{user.id}/#{form_user.id}/task\">
    #{form_user.form.name}</a>"

    url_update = note.save
    if url_update
      puts "URL updated for form user with id #{form_user.id}"
    else
      puts "Failed to update URL for form user with id #{form_user.id}"
    end
  end
end
