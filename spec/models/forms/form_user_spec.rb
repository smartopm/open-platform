# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Forms::FormUser, type: :model do
  describe 'schema' do
    it { is_expected.to have_db_column(:form_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:user_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status_updated_by_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:status).of_type(:integer) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:form) }
    it { is_expected.to belong_to(:user).class_name('Users::User') }
    it { is_expected.to belong_to(:status_updated_by).class_name('Users::User') }
    it { is_expected.to have_many(:user_form_properties).dependent(:destroy) }
    it { is_expected.to have_one(:note).class_name('Notes::Note').dependent(:destroy) }
  end

  describe '#create_form_task' do
    let!(:user) { create(:admin_user) }
    let!(:form) { create(:form, community: user.community) }
    let!(:form_user) { create(:form_user, form: form, user: user, status_updated_by: user) }

    it 'creates a task' do
      previous_notes_count = Notes::Note.count

      form_user.create_form_task
      expect(Notes::Note.count).to eq(previous_notes_count + 1)

      latest_note = Notes::Note.order(:created_at).first
      expect(latest_note.user_id).to eq(user.id)
      expect(latest_note.author_id).to eq(user.id)
    end

    it 'calls TaskCreate.new_from_template for DRC form' do
      form.update(name: 'DRC Project Review Process', grouping_id: form.id)
      form.community.update(name: 'DoubleGDP')

      expect(TaskCreate).to receive(:new_from_template)
      form_user.create_form_task
    end

    it 'does not call TaskCreate.new_from_template for non DRC form' do
      # Create DRC form to ensure is will be ignored
      drc_form = create(:form, community: user.community, name: 'DRC Project Review Process')
      drc_form.update(grouping_id: drc_form.id)

      form.update(name: 'A random form', grouping_id: form.id)
      form.community.update(name: 'DoubleGDP')

      expect(TaskCreate).not_to receive(:new_from_template)
      expect(TaskCreate).to receive(:new_from_action)
      form_user.create_form_task
    end

    describe 'Task body' do
      let(:project_name_property) { create(:form_property, form: form, field_name: 'Test Field') }
      let(:user_form_property) do
        create(:user_form_property,
               form_property: project_name_property,
               form_user: form_user,
               value: 'Test value',
               user: user)
      end

      before do
        form.community.update(name: 'DoubleGDP')
      end

      it 'sets body as Project Developer name for DRC forms' do
        form.update(name: 'DRC Project Review Process', grouping_id: form.id)
        developer_name_field = create(:form_property, form: form, field_name: 'Project Developer')
        project_developer_user_property = create(:user_form_property,
                                                 form_property: developer_name_field,
                                                 form_user: form_user,
                                                 value: 'DoubleGDP LLC',
                                                 user: user)

        expect(TaskCreate).to receive(:new_from_action).with(
          hash_including(body: project_developer_user_property.value),
        )
        form_user.create_form_task
      end

      it 'set body as form name for non DRC forms' do
        create(:user_form_property,
               form_property: project_name_property,
               form_user: form_user,
               value: 'DoubleGDP LLC', user: user)

        expect(TaskCreate).to receive(:new_from_action).with(hash_including(body: form.name))
        form_user.create_form_task
      end

      it 'sets a default body for DRC form with no set developer name' do
        form.update(name: 'DRC Project Review Process', grouping_id: form.id)

        expect(TaskCreate).to receive(:new_from_action).with(hash_including(body: form.name))
        form_user.create_form_task
      end
    end
  end
end
