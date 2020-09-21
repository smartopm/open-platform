# frozen_string_literal: true

# Method responsbile for handling sendgrid inbound emails
class SendgridController < ApplicationController
    skip_before_action :verify_authenticity_token, if: :valid_webhook_token?

    def webhook
        begin
        # email comes like this user <user@gdp.com> get the value in angle brackets
        email = params["from"].match /\<([^}]+)\>/
        name = params["from"].match /(?<=\s|^)\w+(?=\s)/
        # Find a user 
        sender = @site_community.users.find_by(email: email[1])
        # user = 
        # if sender.nil?
        #     @site_community.users.create!(name: name[0], email: email[1], user_type: "visitor")
        # end

        sender.messages.create(
            is_read: false, sender_id: sender.id,
            created_at: Time.zone.now,
            message: "#{params['subject']} /n #{params['text']}", 
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

    private
    def valid_webhook_token?
        params[:token] == ENV["SENDGRID_WEBHOOK_TOKEN"]
    end
end