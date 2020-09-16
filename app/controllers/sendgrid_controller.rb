# frozen_string_literal: true

# Method responsbile for handling sendgrid inbound emails
class SendgridController < ApplicationController
    # authenticate user here
    # before_action :ensure_admin

    def webhook
        begin
        request_load = JSON.parse(request.body)
        puts request_load
        puts "================================"
        rescue Exception => ex
        # Find a way of properly channeling this error 
        render :json => {:status => 400, :error => "Webhook failed"} and return
        end
        # I want to get the received json and save in in Message table
        render :json => {:status => 200}
    end
end