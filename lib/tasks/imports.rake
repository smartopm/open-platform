# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
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
        User.already_existing(email, [phone_number], community).each do |u|
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
            valuation_amount = nil
            plot_type = existing_parcel.parcel_type&.downcase

            case plot_type
            when 'starter'
              valuation_amount = 230_000
            when 'basic'
              valuation_amount = 305_000
            when 'standard'
              valuation_amount = 540_000
            when 'premium'
              valuation_amount = 1_417_940
            else
              errors[row_num + 1] = 'Error: Invalid plot type'
              next
            end

            next if user.payment_plans.find_by(land_parcel_id: existing_parcel.id).present?

            plan = user.payment_plans.create(
              land_parcel: existing_parcel,
              status: PaymentPlan.statuses[:active],
              start_date: start_date,
              plan_type: 'lease',
              percentage: '2.75%',
              total_amount: valuation_amount,
              duration_in_month: 12,
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
        User.already_existing(email, [phone_number], community).each do |u|
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
          payment_plan = existing_parcel.payment_plan
          if payment_plan.present?
            if community.wallet_transactions.find_by(
              created_at: date,
              payment_plan_id: payment_plan.id,
              user_id: user.id,
            ).present?
              warnings[row_num + 1] = 'Warning: Transaction already exists.'
              next
            end

            modes = {
              'CASH' => 'cash',
              'POS' => 'pos',
              'EFT' => 'bank_transfer/eft',
              'MTN Mobile Money' => 'mobile_money',
            }

            transaction = user.wallet_transactions.create(
              source: modes[payment_mode],
              created_at: date,
              status: 'settled',
              destination: 'wallet',
              community_id: community.id,
              depositor_id: current_user.id,
              originally_created_at: current_user.current_time_in_timezone,
              payment_plan_id: payment_plan.id,
              amount: amount,
            )

            unless transaction.persisted?
              errors[row_num + 1] = transaction.errors.full_messages
              next
            end

            payment_plan.update_plot_balance(amount)
            transaction.update(current_wallet_balance: user.wallet.balance + amount)
            user.wallet.update_balance(amount)
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

        puts "processing row: #{row_num + 1}, NRC: #{ext_ref_id}"

        if [email, phone_number].compact.empty?
          errors[row_num + 1] = 'Error: No means of identification'
          next
        end

        user = community.users.find_by(ext_ref_id: ext_ref_id)

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
        existing_parcel_with_comm_no = community.land_parcels.find_by(parcel_number: comm_plot_no)
        existing_parcel_with_govt_no = community.land_parcels.find_by(parcel_number: govt_plot_no)

        if existing_parcel_with_comm_no.present? && existing_parcel_with_govt_no.present?
          errors[row_num + 1] = "Error: Both Govt plot number and #{community_name} plot number \
                              are found. Kindly confirm why we have the two, and resolve manually."
          next
        end

        existing_parcel = existing_parcel_with_comm_no || existing_parcel_with_govt_no
        if existing_parcel.present?

          modes = {
            'CASH' => 'cash',
            'POS' => 'pos',
            'EFT' => 'bank_transfer/eft',
            'MTN Mobile Money' => 'mobile_money',
          }
          # Is there a way to check for duplicate transactions
          # so we don't process dulicate transactions if the same doc
          # is imported multiple time???
          transaction = user.wallet_transactions.create(
            source: modes[payment_mode],
            land_parcel_id: existing_parcel,
            created_at: date,
            status: 'settled', # is this status correct?
            destination: 'wallet', # is this correct?
            community_id: community.id,
            depositor_id: current_user.id,
            originally_created_at: current_user.current_time_in_timezone,
            payment_plan_id: land_parcel.payment_plan&.id,
            amount: amount,
          )

          unless transaction.persisted?
            errors[row_num + 1] = transaction.errors.full_messages
            next
          end

          existing_parcel.payment_plan&.update_plot_balance(amount)
          if transaction.settled?
            transaction.update(current_wallet_balance: user.wallet.balance + amount)
            user.wallet.update_balance(amount)
          end
        else
          errors[row_num + 1] = 'Error: Property not found.'
        end
      end

      raise ActiveRecord::Rollback unless errors.empty?
    end

    puts "Errors: #{errors}"
    puts "Warnings: #{warnings}"
    puts 'Records successfully imported' if errors.empty?
  end
end
# rubocop:enable Metrics/BlockLength
