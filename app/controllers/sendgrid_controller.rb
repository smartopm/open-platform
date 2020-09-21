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
        if sender.nil?
            user = @site_community.users.create!(name: name[0], email: email[1], user_type: "visitor")
            generate_msg(user, "#{params['subject']} /n #{params['text']}")
        end

        generate_msg(sender, "#{params['subject']} /n #{params['text']}")
        rescue Exception => ex
        render :json => {:status => 400, :error => ex} and return
        end
        render :json => {:status => 200}
    end

    private
    
    def valid_webhook_token?
        params[:token] == ENV["SENDGRID_WEBHOOK_TOKEN"]
    end

    def generate_msg(user, body)
        user.messages.create(
            is_read: false, sender_id: user.id,
            created_at: Time.zone.now,
            message: body,
            category: 'email',
          )
    end

end