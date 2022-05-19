# frozen_string_literal: true

require 'task_create'
require 'user_validator'

# Execute user bulk import
# rubocop: disable Metrics/ClassLength
class LeadImportJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def perform(csv_string, csv_file_name, current_user)
    errors = {}
    separator = ACSV::Detect.separator(csv_string).presence || ','
    csv = CSV.new(csv_string, headers: true, col_sep: separator)

    ActiveRecord::Base.transaction do
      csv.each_with_index do |row, index|
        name                          = row['Name']&.strip
        email                         = row['Email']&.strip.presence
        secondary_email               = row['Secondary Email']&.strip.presence
        phone                         = row['Primary Phone']&.strip
        secondary_phone               = row['Secondary Phone']&.strip
        title                         = row['Title']&.strip
        linkedin_url                  = row['LinkedIn']&.strip
        contact_1_name                = row['Contact 1 Name']&.strip
        contact_1_title               = row['Contact 1 Title']&.strip
        contact_1_primary_email       = row['Contact 1 Primary Email']&.strip
        contact_1_secondary_email     = row['Contact 1 Secondary Email']&.strip
        contact_1_primary_phone       = row['Contact 1 Primary Phone']&.strip
        contact_1_secondary_phone     = row['Contact 1 Secondary Phone']&.strip
        contact_1_linkedin            = row['Contact 1 LinkedIn']&.strip
        contact_2_name                = row['Contact 2 Name']&.strip
        contact_2_title               = row['Contact 2 Title']&.strip
        contact_2_primary_email       = row['Contact 2 Primary Email']&.strip
        contact_2_secondary_email     = row['Contact 2 Secondary Email']&.strip
        contact_2_primary_phone       = row['Contact 2 Primary Phone']&.strip
        contact_2_secondary_phone     = row['Contact 2 Secondary Phone']&.strip
        contact_2_linkedin            = row['Contact 2 LinkedIn']&.strip
        country                       = row['Country']&.strip
        region                        = row['Region']&.strip
        company_name                  = row['Company Name']&.strip
        company_linkedin              = row['Company LinkedIn']&.strip
        company_description           = row['Company Description']&.strip
        company_website               = row['Company Website']&.strip
        company_employees             = row['Number of Employees']&.strip
        company_annual_revenue        = row['Annual Revenue']&.strip
        company_contacted             = row['Company Contacted']&.strip
        african_presence              = row['African Presences']&.strip
        industry                      = row['Industry Sector']&.strip
        industry_sub_sector           = row['Industry Sub Sector']&.strip
        industry_business_activity    = row['Industry Business Activity']&.strip
        relevant_link                 = row['Relevant Links']&.strip
        level_of_internationalization = row['Level of Internationalization']&.strip
        lead_temperature              = row['Lead Temperature']&.strip
        lead_status                   = row['Lead Status']&.strip
        lead_source                   = row['Lead Source']&.strip
        lead_type                     = row['Lead Type']&.strip
        lead_owner                    = row['Lead Owner']&.strip
        client_category               = row['Client Category']&.strip
        next_steps                    = row['Next Steps']&.strip
        first_contact_date            = row['First Contact Date']&.strip
        last_contact_date             = row['Last Contact Date']&.strip
        followup_at                   = row['Date Follow Up']&.strip
        created_by                    = row['Created By']&.strip
        modified_by                   = row['Modified By']&.strip
        phone_list                    = [phone, secondary_phone].reject(&:blank?)
        kick_off_date                 = row['Kick Off Date']&.strip
        capex_amount                  = row['Capex Amount']&.strip
        jobs_created                  = row['Jobs']&.strip
        jobs_timeline                 = row['Jobs Timeline']&.strip
        investment_size               = row['Investment Size']&.strip
        investment_timeline           = row['Investment Timeline']&.strip
        decision_timeline             = row['Decision Timeline']&.strip

        if name.blank?
          errors[index + 1] = ['Name must be present']
          next
        end

        # commenting this to allow creating contacts without contact info
        # this can be uupdated from the leads details page if need be as
        # this users will not be logging in

        # if phone_list.empty? && email.nil?
        #   errors[index + 1] = ['A contact info must be present']
        #   next
        # end

        dup_user = UserValidator.duplicate_user(email, phone_list, current_user.community)
        if dup_user.present?
          errors[index + 1] = ['Contact info already exists']
          next
        end

        user = current_user.enroll_user(name: name, email: email,
                                        phone_number: phone,
                                        user_type: 'lead',
                                        secondary_info: {})
        if secondary_email.present?
          user.contact_infos.build(
            contact_type: 'email',
            info: secondary_email,
          )
        end
        if secondary_phone.present?
          user.contact_infos.build(
            contact_type: 'phone',
            info: secondary_phone,
          )
        end

        user.assign_attributes(
          title: title,
          country: country,
          region: region,
          linkedin_url: linkedin_url,
          company_name: company_name,
          company_description: company_description,
          company_linkedin: company_linkedin,
          company_website: company_website,
          company_annual_revenue: company_annual_revenue,
          company_contacted: company_contacted,
          company_employees: company_employees,
          african_presence: african_presence,
          industry: industry,
          industry_sub_sector: industry_sub_sector,
          level_of_internationalization: level_of_internationalization,
          industry_business_activity: industry_business_activity,
          lead_temperature: lead_temperature,
          lead_status: lead_status,
          lead_source: lead_source,
          lead_owner: lead_owner,
          lead_type: lead_type,
          client_category: client_category,
          next_steps: next_steps,
          created_by: created_by,
          modified_by: modified_by,
          relevant_link: relevant_link,
          first_contact_date: first_contact_date,
          last_contact_date: last_contact_date,
          followup_at: followup_at,
          contact_details: {
            "secondaryContact1": {
              "name": contact_1_name,
              "title": contact_1_title,
              "primaryEmail": contact_1_primary_email,
              "secondaryEmail": contact_1_secondary_email,
              "primaryPhoneNumber": contact_1_primary_phone,
              "secondaryPhoneNumber": contact_1_secondary_phone,
              "linkedinUrl": contact_1_linkedin,
            },
            "secondaryContact2": {
              "name": contact_2_name,
              "title": contact_2_title,
              "primaryEmail": contact_2_primary_email,
              "secondaryEmail": contact_2_secondary_email,
              "primaryPhoneNumber": contact_2_primary_phone,
              "secondaryPhoneNumber": contact_2_secondary_phone,
              "linkedinUrl": contact_2_linkedin,
            },
          },
          capex_amount: capex_amount,
          jobs_created: jobs_created,
          jobs_timeline: jobs_timeline,
          kick_off_date: kick_off_date,
          investment_size: investment_size,
          investment_timeline: investment_timeline,
          decision_timeline: decision_timeline,
        )

        if user.save
          current_user.create_lead_task(user)
        else
          errors[index + 1] = user.errors.full_messages
        end
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    current_user.import_logs.create!(
      import_errors: errors.to_json,
      file_name: csv_file_name,
      failed: !errors.empty?,
      community: current_user.community,
    )
  end
  # rubocop:enable Metrics/BlockLength
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
# rubocop: enable Metrics/ClassLength
