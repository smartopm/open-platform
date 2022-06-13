# frozen_string_literal: true

# Count number errors + warnings in Jest log
class JestLog
  BASE_URL = 'https://gitlab.com/api/v4/projects/13905080'

  def self.fetch_job_log(job_id, gitlab_token)
    response = HTTParty.get("#{BASE_URL}/jobs/#{job_id}/trace", headers: {
                              'PRIVATE-TOKEN' => gitlab_token,
                            })
    log_count = (response.body.scan(/console.error/).length +
                  response.body.scan(/console.warn/).length)
    flaky_issue_count = response.body.scan(/AllocatePlanModal/).length

    max_limit = flaky_issue_count > 2 ? 37 : 33

    return unless log_count > max_limit

    abort("#{log_count} Jest issues found. Jest log count shouldn't be more than #{max_limit}")
  end
end
