# frozen_string_literal: true

# create a form with a name
# add form_properties

desc 'create a nkwashi business registration form'
task create_business_form: :environment do
  puts 'create a form ...'
  form = Community.find_by(name: 'Nkwashi').forms.create(
    name: 'Nkwashi Business Registration',
    expires_at: 10.days.from_now,
  )
  # rubocop:disable Layout/LineLength
  properties = [
    {
      field_name: 'Full Business Name',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '1',
    },
    {
      field_name: 'Your email address',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '2',
    },
    {
      field_name: 'Your phone number',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '3',
    },
    {
      field_name: 'Your Nkwashi Plot Number',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '4',
    },
    {
      field_name: 'Shareholders/Partners of Business',
      field_type: 'text',
      field_value: nil,
      required: false,
      admin_use: false,
      order: '5',
    },
    {
      field_name: 'Managing Director/CEO of Business',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '6',
    },
    {
      field_name: 'What does your business do?',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '7',
    },
    {
      field_name: 'Are you interested in raising capital for your business?',
      field_type: 'radio',
      field_value: [
        {
          value: 'Yes',
          label: 'yes',
        },
        {
          value: 'No',
          label: 'No',
        },
      ],
      required: true,
      admin_use: false,
      order: '8',
    },
    {
      field_name: 'If you are interested in raising capital for your business. How much do you need',
      field_type: 'radio',
      field_value: [
        {
          value: 'US$25,000 or less',
          label: 'US$25,000 or less',
        },
        {
          value: 'US$25,000 to US$50,000',
          label: 'US$25,000 to US$50,000',
        },
        {
          value: 'US$50,000 to US$100,000',
          label: 'US$50,000 to US$100,000',
        },
        {
          value: 'More than US$100,000',
          label: 'More than US$100,000',
        },
      ],
      required: false,
      admin_use: false,
      order: '9',
    },
    {
      field_name: 'Is your business currently trading?',
      field_type: 'radio',
      field_value: [
        {
          value: 'Yes',
          label: 'yes',
        },
        {
          value: 'No',
          label: 'No',
        },
      ],
      required: true,
      admin_use: false,
      order: '10',
    },
    {
      field_name: 'How many employees do you have?',
      field_type: 'text',
      field_value: nil,
      required: true,
      admin_use: false,
      order: '11',
    },
    {
      field_name: 'Would you benefit from access to international markets to sell your goods or services?',
      field_type: 'radio',
      field_value: [
        {
          value: 'Yes',
          label: 'Yes',
        },
        {
          value: 'No',
          label: 'No',
        },
      ],
      required: true,
      admin_use: false,
      order: '12',
    },
    {
      field_name: 'Registered businesses may be required to attend skills development workshops, do you understand this?',
      field_type: 'radio',
      field_value: [
        {
          value: 'Yes',
          label: 'Yes',
        },
        {
          value: 'No',
          label: 'No',
        },
      ],
      required: true,
      admin_use: false,
      order: '13',
    },
  ]
  # rubocop:enable Layout/LineLength

  begin
    puts 'adding form properties to the form ...'
    form.form_properties.create(properties)
  rescue StandardError => e
    puts 'Something wrong happened'
    puts e.message
    # delete the newly created form to avoid errors next time
    form.delete
  else
    puts 'Successfully create a form with its properties'
  end
end
