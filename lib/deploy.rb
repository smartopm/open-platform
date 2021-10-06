# frozen_string_literal: true

# Push to prod
# rubocop:disable Layout/LineLength
# rubocop:disable Metrics/MethodLength
class Deploy
  TOKEN = ENV['GITLAB_TOKEN']
  BASE_URL = 'https://gitlab.com/api/v4/projects/13905080'

  def self.create_tag!
    tag_name = new_tag_name
    response = HTTParty.post("#{BASE_URL}/repository/tags",
                             body: {
                               tag_name: tag_name,
                               message: tag_message,
                               ref: 'master',
                             }.to_json,
                             headers: {
                               'Content-Type' => 'application/json',
                               'Accept' => 'application/json',
                               'Authorization' => "Bearer #{TOKEN}",
                             })

    if response.code == 201
      Rails.logger.info "Successfully created #{tag_name}, you can verify me here https://gitlab.com/doublegdp/app/-/tags/#{tag_name}"
    else
      Rails.logger.error "Error: #{response.message}"
    end
  rescue StandardError => e
    Rails.logger.error "ooops  #{e}"
  end

  def self.new_tag_name
    response = HTTParty.get("#{BASE_URL}/repository/tags")
    increment_version(response.first['name'])
  end

  def self.tag_message
    verified_issues = HTTParty.get("#{BASE_URL}/issues?labels=Staging::Verified&state=opened")
    message = verified_issues.map do |issue|
      "#{issue['iid']} #{issue['web_url']} #{issue['title']}    \n"
    end
    message.join('')
  end

  def self.increment_version(version)
    major, minor, patch = version.split('.').map(&:to_i)
    if (patch += 1) > 9
      patch = 0
      if (minor += 1) > 9
        minor = 0
        major += 1
      end
    end
    [major, minor, patch].join('.')
  end
end
# rubocop:enable Layout/LineLength
# rubocop:enable Metrics/MethodLength
