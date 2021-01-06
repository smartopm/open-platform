# frozen_string_literal: true

FactoryBot.define do
  sequence :template_name do |n|
    "template-#{n}"
  end

  factory :email_template do
    name { generate(:template_name) }
    subject { 'Greetings!' }
    body { '<h1> Helloo </h1>' }
  end
end
