# frozen_string_literal: true

namespace :land_parcels do
  desc 'imports plot info'
  task :import_plot_info, %i[community_name csv_string] => :environment do |_t, args|
    errors        = {}
    warnings      = {}
    community     = Community.find_by(name: args.community_name)
    current_user  = User.find_by(email: 'mutale@doublegdp.com')

    User.skip_callback(:create, :after, :send_email_msg)
    csv = CSV.new(args.csv_string, headers: true)
    ActiveRecord::Base.transaction do
      csv.each_with_index do |row, index|
        name          = "#{row['NAME']&.strip} #{row['SURNAME']&.strip}".presence
        email         = row['EMAIL']&.strip&.presence
        parcel_number = row['PLOT NUMBER']&.strip&.presence
        phone_number  = row['PHONE NUMBER']&.strip&.presence
        ext_ref_id    = row['NRC']&.strip&.presence
        parcel_type   = row['PLOT TYPE']&.strip&.presence

        if [name, email, parcel_number, phone_number, ext_ref_id, parcel_type].compact.count < 6
          errors[0]   = "Error: Kindly ensure that the following headers are present and written correctly:
                        NAME, EMAIL, PLOT NUMBER, PHONE NUMBER, NRC"
          break
        end

        if [email, phone_number].compact.empty?
          errors[index + 1] = 'Error: No means of identification'
        end

        user   = community.users.find_by(ext_ref_id: ext_ref_id)

        clients = []
        others = []
        User.already_existing(email, [phone_number], community).each do |u|
          if u.user_type == 'client'
            clients << u
          else
            others << u
          end
        end

        if clients.size > 1
          errors[index + 1] = 'Error: Multiple clients found for this row.'
          next
        end

        if others.size > 1 && client.empty?
          errors[index + 1] = 'Error: Multiple users found and none is a client'
          next
        end

        if client.size == 1 && !others.empty?
          warnings[index + 1] = "Warning: Some other user types were found for this row.
                                 Consider merging them via the app"
        end

        user ||= clients.first || others.first
        user ||= current_user.enroll_user(
                  name: name,
                  email: email,
                  phone_number: phone_number,
                  user_type: 'client'
                )

        if user.ext_ref_id.present?
          if user.ext_ref_id != ext_ref_id
            errors[index + 1] = "Error: External ref IDs do not match"
            next
          end
        end

        user.ext_ref_id = ext_ref_id
        user.user_type = 'client' if user.user_type != 'client'
        user.save!

        comm_plot_no, govt_plot_no = parcel_number.split(/\(|\)/i).map(&:strip)
        existing_parcel_with_comm_no = community.land_parcels.find_by(parcel_number: comm_plot_no)
        existing_parcel_with_govt_no = community.land_parcels.find_by(parcel_number: govt_plot_no)

        if (existing_parcel_with_comm_no.present? && existing_parcel_with_govt_no.present?)
          errors[index + 1] = "Error: Both Govt plot number and #{community_name} plot number are found.
                               Kindly confirm why we have the two, and resolve manually."
          next
        end

        existing_parcel = existing_parcel_with_comm_no || existing_parcel_with_govt_no
        if existing_parcel.present?
          if existing_parcel.accounts.find_by(user_id: user.id).nil?
            errors[index + 1] = "Error: This plot has already been assigned to https://#{HostEnv.base_url(community)}/user/#{user.id}.
                                  Kindly confirm if they both own the plot and resolve manually"
          end
          next
        end

        land_parcel = community.land_parcels.create!(
          parcel_number: (comm_plot_no || govt_plot_no),
          parcel_type: parcel_type,
        )
        land_parcel.accounts.create!(user_id: user.id, full_name: user.name, community: community)
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    puts "The following are the issues encountered:"
    puts "Errors: #{errors}"
    puts "Warnings: #{warnings}"
    User.set_callback(:create, :after, :send_email_msg)
  end
end
