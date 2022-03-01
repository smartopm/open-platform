# frozen_string_literal: true

require 'host_env'

namespace :land_parcels do
  desc 'imports plot info'
  task :import_plot_info, %i[community_name csv_path] => :environment do |_t, args|
    errors        = {}
    warnings      = {}
    community     = Community.find_by(name: args.community_name)
    current_user  = community.users.find_by(email: 'mutale@doublegdp.com')

    Users::User.skip_callback(:create, :after, :send_email_msg)
    row_num = 0
    ActiveRecord::Base.transaction do
      CSV.parse(URI.open(args.csv_path).read, headers: true) do |row|
        row_num += 1
        name = "#{row['NAME']&.strip} #{row['SURNAME']&.strip}".presence
        email = row['EMAIL']&.strip&.presence
        parcel_number = row['PLOT NUMBER']&.strip
        phone_number  = row['PHONE NUMBER']&.strip&.presence
        ext_ref_id    = row['NRC']&.strip&.presence
        parcel_type   = row['PLOT TYPE']&.strip&.presence

        puts "processing row: #{row_num + 1}, NRC: #{ext_ref_id}"

        if [email, phone_number].compact.empty?
          errors[row_num + 1] = 'Error: No means of identification'
          next
        end

        user = community.users.find_by(ext_ref_id: ext_ref_id)

        clients = []
        others = []
        Users::User.already_existing(email, [phone_number], community).each do |u|
          if u.user_type == 'client'
            clients << u
          else
            others << u
          end
        end

        if clients.size > 1
          errors[row_num + 1] = 'Error: Multiple clients found for this row.'
          next
        end

        if others.size > 1 && clients.empty?
          errors[row_num + 1] = 'Error: Multiple users found and none is a client'
          next
        end

        if clients.size == 1 && !others.empty?
          warnings[row_num + 1] = "Warning: Some other user types were found for this row.
                                 Consider merging them via the app"
        end

        user ||= clients.first || others.first
        user ||= current_user.enroll_user(
          name: name,
          email: email,
          phone_number: phone_number,
          user_type: 'client',
        )

        if user.ext_ref_id.present? && user.ext_ref_id != ext_ref_id
          errors[row_num + 1] = 'Error: External ref IDs do not match'
          next
        end

        user.ext_ref_id = ext_ref_id
        user.user_type = 'client' if user.user_type != 'client'

        unless user.save
          errors[row_num + 1] = user.errors.full_messages
          next
        end

        comm_plot_no, govt_plot_no = parcel_number.split(/\(|\)/i).map(&:strip)
        parcel_with_comm_no, parcel_with_govt_no = user.regular_and_govt_plots(
          comm_plot_no,
          govt_plot_no,
        )
        if parcel_with_comm_no.present? && parcel_with_govt_no.present?
          errors[row_num + 1] = "Error: Both Govt plot number and #{community_name} plot number \
                              are found. Kindly confirm why we have the two, and resolve manually."
          next
        end

        existing_parcel = parcel_with_comm_no || parcel_with_govt_no
        if existing_parcel.present?
          if existing_parcel.accounts.find_by(user_id: user.id).nil?
            errors[row_num + 1] = "Error: This plot has already been assigned to
                                    https://#{HostEnv.base_url(community)}/user/#{user.id}.
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

    puts "Errors: #{errors}"
    puts "Warnings: #{warnings}"
    puts 'Records successfully imported' if errors.empty?
    Users::User.set_callback(:create, :after, :send_email_msg)
  end
end
