# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::User, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:email).of_type(:string) }
    it { is_expected.to have_db_column(:provider).of_type(:string) }
    it { is_expected.to have_db_column(:uid).of_type(:string) }
    it { is_expected.to have_db_column(:token).of_type(:string) }
    it { is_expected.to have_db_column(:oauth_expires).of_type(:boolean) }
    it { is_expected.to have_db_column(:oauth_expires_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:refresh_token).of_type(:string) }
    it { is_expected.to have_db_column(:image_url).of_type(:string) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:phone_number).of_type(:string) }
    it { is_expected.to have_db_column(:phone_token).of_type(:string) }
    it { is_expected.to have_db_column(:phone_token_expires_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:user_type).of_type(:string) }
    it { is_expected.to have_db_column(:request_reason).of_type(:string) }
    it { is_expected.to have_db_column(:request_status).of_type(:string) }
    it { is_expected.to have_db_column(:request_note).of_type(:text) }
    it { is_expected.to have_db_column(:vehicle).of_type(:string) }
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:last_activity_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:state).of_type(:string) }
    it { is_expected.to have_db_column(:expires_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:source).of_type(:string) }
    it { is_expected.to have_db_column(:stage).of_type(:string) }
    it { is_expected.to have_db_column(:owner_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:id_number).of_type(:string) }
    it { is_expected.to have_db_column(:followup_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:sub_status).of_type(:integer) }
    it { is_expected.to have_db_column(:address).of_type(:string) }
    it { is_expected.to have_db_column(:latest_substatus_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:ext_ref_id).of_type(:string) }
    it { is_expected.to have_db_column(:role_id).of_type(:uuid).with_options(null: false) }
    it { is_expected.to have_db_column(:region).of_type(:string) }
    it { is_expected.to have_db_column(:title).of_type(:string) }
    it { is_expected.to have_db_column(:linkedin_url).of_type(:string) }
    it { is_expected.to have_db_column(:company_name).of_type(:string) }
    it { is_expected.to have_db_column(:country).of_type(:string) }
    it { is_expected.to have_db_column(:company_description).of_type(:string) }
    it { is_expected.to have_db_column(:company_linkedin).of_type(:string) }
    it { is_expected.to have_db_column(:company_website).of_type(:string) }
    it { is_expected.to have_db_column(:company_employees).of_type(:string) }
    it { is_expected.to have_db_column(:company_annual_revenue).of_type(:string) }
    it { is_expected.to have_db_column(:company_contacted).of_type(:string) }
    it { is_expected.to have_db_column(:industry_sub_sector).of_type(:string) }
    it { is_expected.to have_db_column(:industry_business_activity).of_type(:string) }
    it { is_expected.to have_db_column(:industry).of_type(:string) }
    it { is_expected.to have_db_column(:level_of_internationalization).of_type(:string) }
    it { is_expected.to have_db_column(:lead_temperature).of_type(:string) }
    it { is_expected.to have_db_column(:lead_status).of_type(:string) }
    it { is_expected.to have_db_column(:lead_source).of_type(:string) }
    it { is_expected.to have_db_column(:lead_owner).of_type(:string) }
    it { is_expected.to have_db_column(:lead_type).of_type(:string) }
    it { is_expected.to have_db_column(:client_category).of_type(:string) }
    it { is_expected.to have_db_column(:next_steps).of_type(:text) }
    it { is_expected.to have_db_column(:last_contact_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:modified_by).of_type(:string) }
    it { is_expected.to have_db_column(:first_contact_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:created_by).of_type(:string) }
    it { is_expected.to have_db_column(:relevant_link).of_type(:string) }
    it { is_expected.to have_db_column(:contact_details).of_type(:jsonb) }
    it { is_expected.to have_db_column(:african_presence).of_type(:string) }
    it { is_expected.to have_db_column(:task_id).of_type(:string) }
    it { is_expected.to have_db_column(:capex_amount).of_type(:string) }
    it { is_expected.to have_db_column(:jobs_created).of_type(:string) }
    it { is_expected.to have_db_column(:jobs_timeline).of_type(:string) }
    it { is_expected.to have_db_column(:kick_off_date).of_type(:datetime) }
    it { is_expected.to have_db_column(:investment_size).of_type(:string) }
    it { is_expected.to have_db_column(:investment_timeline).of_type(:string) }
    it { is_expected.to have_db_column(:decision_timeline).of_type(:string) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community).without_validating_presence }
    it do
      is_expected
        .to have_many(:entry_requests)
        .class_name('Logs::EntryRequest')
        .dependent(:destroy)
    end
    it do
      is_expected.to have_many(:granted_entry_requests)
        .class_name('Logs::EntryRequest')
        .inverse_of(:user)
        .with_foreign_key(:grantor_id)
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:payments).class_name('Payments::Payment').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:invoices)
        .class_name('Payments::Invoice')
        .dependent(:destroy)
        .inverse_of(:user)
    end
    it { is_expected.to have_many(:notes).class_name('Notes::Note').dependent(:destroy) }
    it { is_expected.to have_many(:lead_logs).class_name('Logs::LeadLog').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:notifications)
        .class_name('Notifications::Notification')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:note_comments)
        .class_name('Comments::NoteComment')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:messages)
        .class_name('Notifications::Message')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:time_sheets).dependent(:destroy) }
    it do
      is_expected
        .to have_many(:accounts)
        .class_name('Properties::Account')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:comments)
        .class_name('Comments::Comment')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:discussion_users)
        .class_name('Discussions::DiscussionUser')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:discussions)
        .through(:discussion_users)
        .class_name('Discussions::Discussion')
    end
    it do
      is_expected
        .to have_many(:land_parcels)
        .class_name('Properties::LandParcel')
        .through(:accounts)
    end
    it { is_expected.to have_many(:businesses).dependent(:destroy) }
    it do
      is_expected
        .to have_many(:user_labels)
        .class_name('Labels::UserLabel')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:contact_infos).dependent(:destroy) }
    it { is_expected.to have_many(:labels).through(:user_labels).class_name('Labels::Label') }
    it do
      is_expected
        .to have_many(:assignee_notes)
        .class_name('Notes::AssigneeNote')
        .dependent(:destroy)
    end
    it do
      is_expected.to have_many(:acting_event_log)
        .class_name('Logs::EventLog')
        .with_foreign_key(:acting_user_id)
        .inverse_of(false)
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:tasks)
        .through(:assignee_notes)
        .class_name('Notes::Note')
        .source(:note)
    end
    it { is_expected.to have_many(:activity_points).dependent(:destroy) }
    it do
      is_expected
        .to have_many(:user_form_properties)
        .class_name('Forms::UserFormProperty')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:form_users).class_name('Forms::FormUser').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:post_tag_users)
        .class_name('PostTags::PostTagUser')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:post_tags)
        .through(:post_tag_users)
        .class_name('PostTags::PostTag')
    end
    it do
      is_expected
        .to have_many(:wallet_transactions)
        .class_name('Payments::WalletTransaction')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:wallets).class_name('Payments::Wallet').dependent(:destroy) }
    it do
      is_expected
        .to have_many(:payment_plans)
        .class_name('Properties::PaymentPlan')
        .dependent(:destroy)
    end
    it do
      is_expected
        .to have_many(:substatus_logs)
        .class_name('Logs::SubstatusLog')
        .dependent(:destroy)
    end
    it { is_expected.to have_many(:import_logs).class_name('Logs::ImportLog').dependent(:destroy) }
    it do
      is_expected.to have_many(:transactions)
        .class_name('Payments::Transaction')
        .dependent(:destroy)
    end
    it do
      is_expected.to have_many(:plan_payments)
        .class_name('Payments::PlanPayment')
        .dependent(:destroy)
    end
    it { is_expected.to have_one(:avatar_attachment) }
    it { is_expected.to have_many(:note_documents_attachments) }
    it { is_expected.to have_many(:plan_ownerships).class_name('Properties::PlanOwnership') }
    it { is_expected.to have_many(:reply_to).class_name('Comments::NoteComment') }
    it { is_expected.to have_many(:posts).class_name('Discussions::Post') }
  end

  describe 'enums' do
    it {
      should define_enum_for(:sub_status)
        .with_values(Users::User.sub_statuses)
    }

    it do
      is_expected.to define_enum_for(:status)
        .with_values(
          active: 0, deactivated: 1,
        )
    end
  end

  describe 'scoped validations' do
    let!(:community) { create(:community) }
    let!(:user) do
      create(:user, community_id: community.id, email: 'john@doublegdp.com',
                    phone_number: '9988776655')
    end

    it 'checks for uniqueness of email per community' do
      expect do
        community.users.create!(name: 'john doe', email: 'JOHN@DOUBLEGDP.COM',
                                role: user.role)
      end.to raise_error(
        ActiveRecord::RecordInvalid,
        'Validation failed: Email has already been taken',
      )
    end

    it 'checks for uniqueness of phone number per community' do
      expect do
        community.users.create!(name: 'john doe', phone_number: '9988776655',
                                role: user.role)
      end.to raise_error(
        ActiveRecord::RecordInvalid,
        'Validation failed: Phone Number has already been taken',
      )
    end

    it 'checks for uniqueness of public user name per community' do
      expect do
        community.users.create!(name: 'Public Submission', phone_number: '9908978909655',
                                role: user.role)
        community.users.create!(name: 'Public Submission', phone_number: '9905500000000',
                                role: user.role)
      end.to raise_error(
        ActiveRecord::RecordInvalid,
        'Validation failed: Name Public Submission user already exists',
      )
    end
  end

  describe 'callbacks' do
    describe '#update_associated_request_details' do
      let!(:user) do
        create(:user_with_community,
               name: 'Mark Test',
               email: 'email@doublegdp.com',
               phone_number: '1112223334')
      end
      let!(:admin) { create(:admin_user, community_id: user.community_id) }
      let!(:entry_request) do
        create(:entry_request,
               user: admin,
               guest_id: user.id,
               name: 'test user',
               company_name: 'test user')
      end

      context 'when user is updated' do
        before do
          user.update(name: 'John Doe',
                      email: 'john_doe@doublegdp.com',
                      phone_number: '1234567890')
        end

        it 'should update user details in associated entry' do
          expect(entry_request.reload.name).to eql 'John Doe'
          expect(entry_request.email).to eql 'john_doe@doublegdp.com'
          expect(entry_request.phone_number).to eql '1234567890'
          expect(entry_request.company_name).to eql 'John Doe'
        end
      end
    end

    describe '#log_user_create_event' do
      let(:user) do
        build(:user_with_community,
              name: 'Mark Test',
              email: 'email@doublegdp.com',
              phone_number: '1112223334')
      end
      let(:event) { 'user_create' }

      context 'when user is created' do
        it 'should create event log' do
          expect(ActionFlowJob).to receive(:perform_later)
          user.save
          expect(Logs::EventLog.count).to eql 1
          expect(Logs::EventLog.first.subject).to eql 'user_create'
        end
      end
    end

    describe '#associate_lead_labels' do
      let(:user) do
        build(:lead, lead_status: 'Signed Lease', division: 'China')
      end

      context 'when user is created' do
        before { user.save }

        it 'creates labels for the lead user' do
          expect(user.labels.where(grouping_name: 'Division').count).to eql 1
          expect(user.labels.where(grouping_name: 'Status').count).to eql 1
        end
      end

      context 'when user is updated' do
        before { user.save }

        it 'updates existing user label' do
          expect(Labels::Label.count).to eql 5
          # 3 notification labels are added by default
          expect(user.user_labels.count).to eql 5

          user.update(lead_status: 'Site Visit', division: 'Europe')

          # 2 labels are created for Site Visit and Europe
          expect(Labels::Label.count).to eql 7
          expect(user.user_labels.count).to eql 5
        end
      end
    end
  end

  describe 'Creating a user from a oauth authentication callback' do
    let!(:community) { create(:community, name: 'Nkwashi') }
    let!(:role) { create(:role, name: 'visitor') }
    let!(:admin_role) { create(:role, name: 'admin') }
    auth_obj = OpenStruct.new(
      uid: 'abc12345',
      provider: 'google_oauth2',
      info: OpenStruct.new(
        name: 'Mark',
        email: 'mark@doublegdp.com',
        image: 'https://mypic.com/image.png',
        phone_number: '1234567890',
      ),
      credentials: OpenStruct.new(
        token: '12345',
        expires: true,
        expires_at: 1_234_567_890,
        refresh_token: 'foo',
      ),
    )

    it 'should create a new user' do
      user = Users::User.from_omniauth(auth_obj, community)
      expect(user.persisted?).to be true
      # TODO: Remove this once we fix hardcoding
      expect(user.community.name).to eql('Nkwashi')
    end

    it 'should not update an existing user from oauth providers' do
      Users::User.from_omniauth(auth_obj, community)
      auth_obj.info.name = 'Mark Percival'
      auth_obj.info.image = 'https://newprofile.com/pic.png'
      Users::User.from_omniauth(auth_obj, community)
      users = Users::User.where(uid: auth_obj.uid, provider: auth_obj.provider).all
      expect(users.length).to be 1
      expect(users[0].name).to eq 'Mark'
      expect(users[0].image_url).to eq 'https://mypic.com/image.png'
      expect(users[0].oauth_expires).to be true
      expect(users[0].community).to eq community
    end
  end

  describe 'Authenticating the user with a token via sms' do
    let!(:user) { create(:user_with_community, phone_number: '14157351116') }

    it 'should create a token' do
      user.create_new_phone_token
      expect(user.phone_token).to be
      expect(user.phone_token.length).to equal(Users::User::PHONE_TOKEN_LEN)
      expect(
        user.phone_token_expires_at <=
        Users::User::PHONE_TOKEN_EXPIRATION_MINUTES.minutes.from_now,
      ).to be true
    end

    it 'should accept a valid token' do
      token = user.create_new_phone_token
      expect(user.verify_phone_token!(token)).to be true
    end

    it 'should reject invalid and expired token' do
      token = user.create_new_phone_token

      # With a wrong token
      wrong_token = (token.to_i(10) - 1).to_s(10)
      expect { user.verify_phone_token!(wrong_token) }
        .to raise_exception(Users::User::PhoneTokenResultInvalid)

      # With an expired token
      user.update(phone_token_expires_at: 1.minute.ago)
      expect { user.verify_phone_token!(token) }
        .to raise_exception(Users::User::PhoneTokenResultExpired)
    end

    it 'should send phone token via sms if token generation is successful' do
      expect(Sms).to receive(:send)
      user.send_phone_token
    end

    it 'should UserError raise error if no phone number' do
      user.phone_number = nil

      expect do
        user.send_phone_token
      end.to raise_error(Users::User::UserError)
    end

    it 'should TokenGenerationFailed raise error if token generation is not successful' do
      allow(user).to receive(:create_new_phone_token).and_return(nil)

      expect do
        user.send_phone_token
      end.to raise_error(Users::User::TokenGenerationFailed)
    end

    it 'should send one time login via sms if token generation is successful' do
      expect(Sms).to receive(:send)
      user.send_one_time_login
    end

    it 'should UserError raise error if no phone number' do
      user.phone_number = nil

      expect do
        user.send_one_time_login
      end.to raise_error(Users::User::UserError)
    end

    it 'should raise TokenGenerationFailed error if token generation is not successful' do
      allow(user).to receive(:create_new_phone_token).and_return(nil)

      expect do
        user.send_one_time_login
      end.to raise_error(Users::User::TokenGenerationFailed)
    end

    it 'should send one time login via email if token generation is successful' do
      create(:email_template, community: user.community,
                              name: 'one_time_login_template', tag: 'system')

      expect(EmailMsg).to receive(:send_mail_from_db)
      user.send_one_time_login_email
    end

    it 'should not send one time login via email if no email template is found' do
      expect(EmailMsg).not_to receive(:send_mail_from_db)
      user.send_one_time_login_email
    end

    it 'should UserError raise error if no email' do
      user.email = nil

      expect do
        user.send_one_time_login_email
      end.to raise_error(Users::User::UserError)
    end

    it 'should raise TokenGenerationFailed error if token generation is not successful' do
      allow(user).to receive(:create_new_phone_token).and_return(nil)

      expect do
        user.send_one_time_login_email
      end.to raise_error(Users::User::TokenGenerationFailed)
    end
  end

  describe 'User state, type and roles' do
    let!(:role) { create(:role, name: 'visitor') }
    let!(:admin_role) { create(:role, name: 'admin') }
    let!(:user) { create(:user_with_community, phone_number: '14157351116', role: role) }

    it 'without a state/type it should be pending and visitor' do
      expect(user.pending?).to be true
      expect(user.user_type).to eq('visitor')
      expect(user.role.name).to eq('visitor')
    end

    it 'updates user_type alongside role' do
      user.update(user_type: 'admin')
      expect(user.user_type).to eq('admin')
      expect(user.role.name).to eq('admin')
    end

    it 'Roles should have a human name' do
      user.update(user_type: 'admin')
      expect(user.role_name).to eql 'Admin'
    end

    it 'should be expired if it\'s expired' do
      user.update(state: 'pending')
      expect(user.state).to eql 'pending'
    end

    it 'should be expired if it\'s expired' do
      user.update(expires_at: 1.week.ago)
      expect(user.expired?).to be true
    end
  end

  describe 'User with user_type roles' do
    let!(:security_guard) { create(:security_guard) }
    let!(:admin) { create(:admin_user, community: security_guard.community) }
    let!(:user) { create(:user, community: security_guard.community) }

    it 'should know if user an admin' do
      user.update(user_type: 'admin')
      expect(user.admin?).to be true
    end

    it 'should be able to check if user belongs to a role?' do
      expect(admin.role?(%i[security_guard admin])).to be true
      expect(admin.role?([:security_guard])).to be false
    end

    it 'should allow users to become other users' do
      expect(admin.can_become?(security_guard)).to be true
      expect(user.can_become?(security_guard)).to be false
      expect(security_guard.can_become?(admin)).to be false
    end
  end

  describe 'User phone numbers' do
    let!(:user) { create(:user_with_community) }

    it 'should be valid' do
      user.update(phone_number: '+1 415 735 1116')
      expect(user.errors.messages[:phone_number]).to be_empty
    end

    it 'should be the proper length' do
      user.update(phone_number: '+1 415 735')
      expect(user.errors.messages[:phone_number]).to_not be_empty
    end

    it 'should not contain more than "-", " ", "+" and numbers' do
      user.update(phone_number: '+1415.735.1116')
      expect(user.errors.messages[:phone_number]).to_not be_empty
    end
  end

  describe 'User with user_type roles' do
    let!(:security_guard) { create(:security_guard) }
    let!(:admin) { create(:admin_user, community: security_guard.community) }
    let!(:user) { create(:user, community: security_guard.community) }

    it 'should know if user an admin' do
      user.update(user_type: 'admin')
      expect(user.admin?).to be true
    end

    it 'should be able to check if user belongs to a role?' do
      expect(admin.role?(%i[security_guard admin])).to be true
      expect(admin.role?([:security_guard])).to be false
    end

    it 'should allow users to become other users' do
      expect(admin.can_become?(security_guard)).to be true
      expect(user.can_become?(security_guard)).to be false
      expect(security_guard.can_become?(admin)).to be false
    end

    it 'should allow admin to enroll users' do
      vals = {
        name: 'Mark Percival',
        email: 'mark@doublegdp.com',
        request_reason: 'Resident',
        vehicle: nil,
        phone_number: '1234567890',
      }
      nuser = admin.enroll_user(vals)
      expect(nuser.community_id).to be admin.community_id
      expect(nuser.id).to_not be_empty
      nuser1 = nil
      begin
        nuser1 = admin.enroll_user(vals)
      rescue ActiveRecord::RecordNotUnique
        expect(nuser1).to be nil
      end
      el = Logs::EventLog.find_by(subject: 'user_enrolled')
      expect(nuser.id).to eq el.ref_id
      expect(admin.id).to eq el.acting_user_id
    end

    it 'it should create a todo after a referral client has been created' do
      other_user = FactoryBot.create(:client, phone_number: '34566784561')
      user_ref = {
        id: user.id,
        name: 'Test name',
      }
      expect(other_user.user_type).to_not eql 'admin'
      todo = other_user.referral_todo(user_ref)
      notes = Notes::Note.where(author_id: other_user.id)
      expect(Notes::Note.all.count).to eql 1
      expect(notes.length).to eql 1
      expect(todo).to_not be_nil
    end
  end

  describe 'User discussions' do
    let!(:community) { create(:community) }
    let!(:current_user) { create(:user, community_id: community.id) }
    # create a discussion for the user community
    let!(:user_discussion) do
      create(:discussion, user_id: current_user.id, community_id: current_user.community_id)
    end
    let!(:user_post_discussion) do
      create(:discussion, user_id: current_user.id, post_id: '20',
                          community_id: current_user.community_id)
    end
    it 'should return community discussions' do
      expect(current_user.find_user_discussion(user_discussion.id, 'discuss')).not_to be_nil
      expect(current_user.find_user_discussion(user_discussion.id,
                                               'discuss').id).to eql user_discussion.id
    end
    it 'should return community post discussions' do
      expect(current_user.find_user_discussion(user_post_discussion.post_id, 'post')).not_to be_nil
      expect(current_user.find_user_discussion(user_post_discussion.post_id,
                                               'post').post_id).not_to be_nil
      expect(current_user.find_user_discussion(user_post_discussion.post_id,
                                               'post').post_id).to eql '20'
    end
  end

  describe '#activity_point_for_current_week' do
    it 'returns activity points for the current week' do
      user = create(:user_with_community)
      activity_point1 = create(:activity_point, user: user, article_read: 2, referral: 10)
      activity_point2 = create(:activity_point, user: user, article_read: 1, referral: 20)

      activity_point1.update(created_at: 9.days.ago)
      expect(user.activity_point_for_current_week).to eq(activity_point2)
    end
  end

  describe '#first_login_today?' do
    it "returns true if a logged-in user has a 'user_login' event created today" do
      current_user = create(:user_with_community)
      create(:event_log, acting_user: current_user, subject: 'user_login',
                         community: current_user.community)

      expect(current_user.first_login_today?).to eq(true)
    end

    it "returns false if a logged-in user has multiple 'user_login' events created today" do
      current_user = create(:user_with_community)
      2.times do
        create(:event_log, acting_user: current_user, subject: 'user_login',
                           community: current_user.community)
      end

      expect(current_user.first_login_today?).to eq(false)
    end
  end

  describe '#note_assigned?' do
    let!(:user) { create(:user_with_community) }
    let!(:note) do
      create(:note, user: create(:user_with_community, role: user.role),
                    author: create(:user_with_community, role: user.role))
    end
    let!(:assignee_note) { create(:assignee_note, user: user, note: note) }

    it 'returns true if a note is assigned to a user and false otherwise' do
      expect(user.note_assigned?(note.id)).to eq(true)

      note.assign_or_unassign_user(user.id)

      expect(user.note_assigned?(note.id)).to eq(false)
    end
  end

  describe '#invite_guest' do
    let!(:user) { create(:user_with_community) }
    let!(:resident) { create(:resident) }
    let!(:entry_request) do
      create(:entry_request, name: 'Test User', reason: 'Visiting', user: user,
                             guest: resident)
    end

    it 'creates an invite' do
      expect(resident.invitees.count).to eq(0)
      resident.invite_guest(nil, nil)
      expect(resident.invitees.count).to eq(0)
      # invite a guest
      resident.invite_guest(user.id, entry_request.id)
      expect(resident.invitees.count).to eq(1)
    end
  end

  describe '#create_lead_task' do
    let(:lead_role) { create(:role, name: 'lead') }
    let!(:user) do
      create(:user_with_community,
             user_type: 'lead',
             lead_status: 'Signed MOU',
             role: lead_role)
    end
    let(:admin) { create(:admin_user, community_id: user.community_id) }

    it 'creates note' do
      expect(admin.notes.count).to eql 0
      expect(user.tasks.count).to eql 0
      admin.create_lead_task(user)
      expect(admin.notes.count).to eql 1
      expect(user.tasks.count).to eql 1
    end
  end

  describe '#create_lead_log' do
    let(:lead_role) { create(:role, name: 'lead') }
    let!(:user) do
      create(:user_with_community,
             user_type: 'lead',
             lead_status: 'Signed MOU',
             role: lead_role)
    end

    it 'creates lead log' do
      expect(user.lead_logs.count).to eql 0
      user.create_lead_log(user.lead_status, user.id)
      expect(user.lead_logs.count).to eql 1
    end
  end
end
