# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Forms::Form, type: :model do
  describe 'form crud' do
    let!(:current_user) { create(:admin_user) }
    let!(:community) { create(:community) }
    let!(:different_community_user) { create(:user_with_community) }
    let(:form) { create(:form, community_id: current_user.community_id) }

    it 'should create a form record' do
      current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      expect(current_user.community.forms.length).to eql 1
      expect(current_user.community.forms.last.name).to eql 'Form Name'
    end

    it 'should create a form record with a name similar to a deleted one' do
      form_one = current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      form_one.update!(status: 2)
      current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      expect(current_user.community.forms.count).to eql 1
      expect(current_user.community.forms.first.name).to eql 'Form Name'
    end

    it 'should create a form record with a name similar to a deleted one' do
      form_one = current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      form_one.update!(status: 2)
      current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      expect(current_user.community.forms.count).to eql 1
      expect(current_user.community.forms.first.name).to eql 'Form Name'
    end

    it 'should validate case sensitive' do
      current_user.community.forms.create!(
        name: 'Form Name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      another_form = current_user.community.forms.new(
        name: 'form name',
        expires_at: (rand * 10).to_i.day.from_now,
      )
      another_form.save
      expect(another_form.errors.full_messages[0]).to eql 'Name has already been taken'
      expect(Forms::Form.count).to eql 1
    end

    it 'should update a form record' do
      expect(form.name).to_not eql 'Updated Name'
      form.update(name: 'Updated Name')
      expect(form.name).to eql 'Updated Name'
    end
  end

  describe 'schema' do
    it { is_expected.to have_db_column(:community_id).of_type(:uuid) }
    it { is_expected.to have_db_column(:name).of_type(:string) }
    it { is_expected.to have_db_column(:expires_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it {
      is_expected.to have_db_column(:multiple_submissions_allowed).of_type(:boolean)
    }
  end

  describe 'associations' do
    it { is_expected.to belong_to(:community) }
    it { is_expected.to have_many(:form_properties) }
    it { is_expected.to have_many(:form_users) }
    it { is_expected.to have_many(:categories) }
    it { is_expected.to have_one(:process).class_name('Processes::Process') }
  end

  describe '#report_an_issue?' do
    let!(:user) { create(:admin_user) }
    let!(:form) { create(:form, community: user.community) }
    let!(:report_form) { create(:form, community: user.community, name: 'Report an Issue') }

    it 'checks if a form is a report-an-issue form' do
      expect(form.report_an_issue?).to eq(false)
      expect(report_form.report_an_issue?).to eq(true)
    end

    context 'when versioning of form is done' do
      before do
        form.update(name: 'Informar de un problema V2')
        report_form.update(name: 'Report an Issue V3')
      end

      it 'should identify report an issue form name' do
        expect(form.report_an_issue?).to eq(true)
        expect(report_form.report_an_issue?).to eq(true)
      end
    end
  end

  describe '#drc_form?' do
    let(:user) { create(:admin_user) }

    it 'returns true if a form is a DRC form' do
      drc_form = create(:form, community: user.community,
                               name: 'DRC Project Review Process')
      drc_form.update(grouping_id: drc_form.id)

      drc_form_v2 = create(:form, community: user.community,
                                  name: 'DRC Project Review Process V2',
                                  grouping_id: drc_form.id, version_number: 2)

      expect(drc_form_v2.drc_form?).to eq(true)
    end

    it 'returns false if a form is not a DRC form' do
      form = create(:form, community: user.community)
      expect(form.drc_form?).to eq(false)
    end
  end

  describe '#associated_process?' do
    let(:user) { create(:admin_user) }
    let(:form) { create(:form, community: user.community, name: 'DRC Form') }

    it 'returns false if there is no process' do
      expect(form.associated_process?).to eq(false)
    end

    it 'returns false if there is no note list' do
      form_with_process = create(:form, community: user.community, name: 'Form 2')
      create(:process, form_id: form_with_process.id, process_type: 'drc', name: 'DRC')

      expect(form_with_process.associated_process?).to eq(false)
    end

    it 'returns true if there is a note list & process' do
      form_with_process_note_list = create(:form, community: user.community, name: 'Form 3')
      process_with_note_list = create(:process,
                                      community: user.community,
                                      form: form_with_process_note_list,
                                      process_type: 'drc',
                                      name: 'DRC')
      create(:note_list, community: user.community, process_id: process_with_note_list.id)

      expect(form_with_process_note_list.associated_process?).to eq(true)
    end
  end

  describe '#process_type' do
    let(:user) { create(:admin_user) }
    let(:form) { create(:form, community: user.community, name: 'DRC Form') }

    it 'returns nil if there is no process' do
      expect(form.process_type).to be_nil
    end

    it 'returns valid process type if process exists' do
      form_with_process = create(:form, community: user.community, name: 'Form 2')
      create(:process, form_id: form_with_process.id, process_type: 'drc', name: 'DRC')

      expect(form_with_process.process_type).to eq('drc')
    end
  end
end
