# frozen_string_literal: true

# Form User Record
class FormUser < ApplicationRecord
  belongs_to :form
  belongs_to :user
  belongs_to :status_updated_by, class_name: 'User'
  has_many :user_form_properties, dependent: :destroy
  has_one :note, dependent: :destroy

  enum status: { draft: 0, pending: 1, approved: 2, rejected: 3 }
  def create_form_task(hostname)
    user.generate_note(
      body: "<a href=\"https://#{hostname}/user/#{user.id}\">#{user.name}</a> Submitted
              <a href=\"https://#{hostname}/user_form/#{form.id}/#{user.id}/#{form.name}/task\">
              #{form.name}</a>",
      category: 'form',
      form_user_id: id,
      flagged: true,
      completed: false,
    )
  end
end
