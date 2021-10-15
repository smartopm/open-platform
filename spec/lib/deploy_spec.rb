# frozen_string_literal: true

require 'rails_helper'
require 'deploy'

# rubocop:disable Layout/LineLength
RSpec.describe Deploy do
  describe '.increment_version' do
    it 'returns a new version number' do
      expect(described_class.increment_version('1.4.9')).to eq('1.5.0')
      expect(described_class.increment_version('1.5.0')).to eq('1.5.1')
    end
  end

  describe '.tag_message' do
    it 'returns a string list of issues' do
      allow(HTTParty).to receive(:get).with(any_args).and_return([
                                                                   { 'iid' => 1, 'title' => 'Issue One', 'web_url' => 'https://gitlab.com/project/issues/1' },
                                                                   { 'iid' => 2, 'title' => 'Issue Two', 'web_url' => 'https://gitlab.com/project/issues/2' },
                                                                 ])

      expected_string = "1 https://gitlab.com/project/issues/1 Issue One    \n2 https://gitlab.com/project/issues/2 Issue Two    \n"
      expect(described_class.tag_message).to eq(expected_string)
    end
  end

  describe '.new_tag_name' do
    it 'returns a new tag name to use' do
      allow(HTTParty).to receive(:get).with(any_args).and_return([
                                                                   { 'name' => '0.5.5' },
                                                                 ])

      expect(described_class.new_tag_name).to eq('0.5.6')
    end
  end

  describe '.release_note' do
    it 'returns a formatted release note' do
      response = [
        { 'iid' => 1, 'title' => 'Issue One', 'web_url' => 'https://gitlab.com/project/issues/1' },
        { 'iid' => 2, 'title' => 'Issue Two', 'web_url' => 'https://gitlab.com/project/issues/2' },
      ]
      allow(HTTParty).to receive(:get).with(any_args).and_return(response)

      expected_result = "| Issue ID | URL | Title |\n"
      expected_result += "|----------|-------|-------|\n"
      mapped_issues = response.map do |issue|
        "|#{issue['iid']}|#{issue['web_url']}|#{issue['title']}|\n"
      end
      expected_result += mapped_issues.join('')
      expect(described_class.release_note).to eq(expected_result)
    end
  end

  describe '.create_tag!' do
    context 'When there are no tickets to deploy' do
      it 'terminates and returns nil' do
        allow(HTTParty).to receive(:get).with('https://gitlab.com/api/v4/projects/13905080/issues?labels=Staging::Verified&state=opened').and_return([])
        allow(HTTParty).to receive(:get).with('https://gitlab.com/api/v4/projects/13905080/repository/tags').and_return([{ 'name' => '0.5.8' }])

        expect(described_class.create_tag!('token')).to eq(nil)
      end
    end
  end
end
# rubocop:enable Layout/LineLength
