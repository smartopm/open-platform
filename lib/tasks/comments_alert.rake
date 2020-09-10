# frozen_string_literal: true

require 'comment_alert'

desc 'send emails for new comments on discussions'
task send_comments_alert: :environment do
  puts 'checking and sending comments ...'
  CommentsAlert.send_email_alert('Nkwashi')
end
