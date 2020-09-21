# frozen_string_literal: true

# Method responsbile for handling sendgrid inbound emails
class SendgridController < ApplicationController
    skip_before_action :verify_authenticity_token #remove this afterwards

    def webhook
        begin
        puts "==========================response========================="
        puts params["to"]
        puts params["text"]
        puts params["from"]
        puts params["subject"]
        # email comes like this user <user@gdp.com> get the value in angle brackets
        email = params["from"].match /\<([^}]+)\>/
        # Find a user 
        puts email[1]
        sender = @site_community.users.find_by(email: email[1])
        sender.messages.create(
            is_read: false, sender_id: sender.id,
            created_at: Time.zone.now,
            # message: "#{params['subject']} #{params['text']}", 
            message: params['subject'] /n params['text'], 
            category: 'email',
          )
        # get the response for 
        rescue Exception => ex
        # Find a way of properly channeling this error 
        render :json => {:status => 400, :error => ex} and return
        end
        # I want to get the received json and save in in Message table
        render :json => {:status => 200}
    end
end