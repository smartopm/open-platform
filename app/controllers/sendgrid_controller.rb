# frozen_string_literal: true

# Method responsbile for handling sendgrid inbound emails
class SendgridController < ApplicationController
    
    def webhook
        begin
        request_load = request
        # get the response for 
        rescue Exception => ex
        # Find a way of properly channeling this error 
        render :json => {:status => 400, :error => ex} and return
        end
        # I want to get the received json and save in in Message table
        render :json => {:status => 200}
    end
end