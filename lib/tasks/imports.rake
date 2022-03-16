# frozen_string_literal: true

namespace :imports do
  desc 'imports payment plans'
  task :payment_plans, %i[community_name csv_path] => :environment do |_t, args|
    errors        = {}
    warnings      = {}
    community     = Community.find_by(name: args.community_name)

    row_num = 0
    ActiveRecord::Base.transaction do
      CSV.parse(URI.open(args.csv_path).read, headers: true) do |row|
        row_num += 1
        email = row['EMAIL']&.strip&.presence
        parcel_number = row['PLOT NUMBER']&.strip
        phone_number  = row['PHONE NUMBER']&.strip&.presence
        ext_ref_id    = row['NRC']&.strip&.presence
        start_date    = row['DATE']&.strip&.presence

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

        if user.nil?
          errors[row_num + 1] = 'Error: User not found.'
          next
        end

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
          parcel_accounts = existing_parcel.accounts
          if parcel_accounts.find_by(user_id: user.id).present?
            monthly_amount = nil
            plot_type = existing_parcel.parcel_type&.downcase

            case plot_type
            when 'starter'
              monthly_amount = 527
            when 'basic'
              monthly_amount = 698.95
            when 'standard'
              monthly_amount = 1237.6
            when 'premium'
              monthly_amount = 3249.45
            else
              errors[row_num + 1] = 'Error: Invalid plot type'
              next
            end

            next if user.payment_plans.find_by(land_parcel_id: existing_parcel.id).present?

            plan = user.payment_plans.create(
              land_parcel: existing_parcel,
              status: Properties::PaymentPlan.statuses[:active],
              start_date: start_date,
              plan_type: 'lease',
              percentage: 2.75,
              installment_amount: monthly_amount,
              total_amount: ((monthly_amount * 12 * 100) / 2.75),
              duration: 12,
            )

            errors[row_num + 1] = plan.errors.full_messages unless plan.persisted?
          else
            errors[row_num + 1] = "Error: This plot has already been assigned to \
                  https://#{HostEnv.base_url(community)}/user/#{parcel_accounts.first&.user&.id}. \
                  Kindly confirm if they both own the plot and resolve manually"
          end
        else
          errors[row_num + 1] = 'Error: Property not found for this user.'
        end
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    puts "Errors: #{errors}"
    puts "Warnings: #{warnings}"
    puts 'Records successfully imported' if errors.empty?
  end

  desc 'imports transactions'
  task :transactions, %i[community_name csv_path] => :environment do |_t, args|
    errors        = {}
    warnings      = {}
    community     = Community.find_by(name: args.community_name)
    current_user  = community.users.find_by(email: 'mutale@doublegdp.com')

    row_num = 0
    ActiveRecord::Base.transaction do
      CSV.parse(URI.open(args.csv_path).read, headers: true) do |row|
        row_num += 1
        email = row['EMAIL']&.strip&.presence
        parcel_number = row['PLOT NUMBER']&.strip
        payment_mode  = row['PAYMENT MODE']&.strip&.presence
        phone_number  = row['PHONE NUMBER']&.strip&.presence
        date          = row['DATE']&.strip&.presence
        amount        = row['AMOUNT PAID']&.strip&.presence
        ext_ref_id    = row['NRC']&.strip&.presence
        receipt_number = row['REC. NUMBER']&.presence

        puts "processing row: #{row_num + 1}, NRC: #{ext_ref_id}"

        if [email, phone_number].compact.empty?
          errors[row_num + 1] = 'Error: No means of identification'
          next
        end

        if amount.nil?
          errors[row_num + 1] = 'Error: Amount is missing.'
          next
        end

        amount = BigDecimal(amount.gsub(',', '_'))

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

        if user.nil?
          errors[row_num + 1] = 'Error: User not found.'
          next
        end

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
          payment_plan = existing_parcel.payment_plans.order(:start_date).first
          if payment_plan.present?
            modes = {
              'CASH' => 'cash',
              'POS' => 'pos',
              'EFT' => 'bank_transfer/eft',
              'MTN Mobile Money' => 'mobile_money',
              'Cash Deposit' => 'bank_transfer/cash_deposit',
            }

            transaction = community.transactions.joins(:plan_payments).find_by(
              amount: amount,
              created_at: date,
              source: modes[payment_mode],
              user_id: user.id,
              plan_payments: { manual_receipt_number: "MI#{receipt_number}" },
            )
            if transaction.present?
              warnings[row_num + 1] = 'Warning: Transaction already exists.'
              next
            end

            transaction = user.transactions.create(
              source: modes[payment_mode],
              created_at: date,
              status: 'accepted',
              community_id: community.id,
              depositor_id: current_user.id,
              originally_created_at: current_user.current_time_in_timezone,
              amount: amount,
            )

            unless transaction.persisted?
              errors[row_num + 1] = transaction.errors.full_messages
              next
            end

            transaction.execute_transaction_callbacks(payment_plan, amount, receipt_number)
          else
            errors[row_num + 1] = 'Error: Payment plan not available.'
          end
        else
          errors[row_num + 1] = 'Error: Property not found for this user.'
        end
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    puts "Errors: #{errors}"
    puts "Warnings: #{warnings}"
    puts 'Records successfully imported' if errors.empty?
  end
end
