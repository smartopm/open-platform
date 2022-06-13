# frozen_string_literal: true

namespace :db do
  desc 'Migrate disccusion comments to posts'
  task migrate_discussion_comments_to_posts: :environment do
    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        community.comments.find_each do |comment|
          post = community.posts.new(comment.attributes.except('id', 'status'))
          post.status = 'deleted' unless comment.status.eql?('valid')
          post.save(validate: false)

          if comment.image.signed_id.present? && post.persisted?
            post.images.attach(comment.image.signed_id)
          end

        rescue ActiveStorage::FileNotFoundError
          next
        end
      end
      puts 'Migrated discussion comments to posts'
    end
  rescue ActiveRecord::RecordInvalid => e
    raise GraphQL::ExecutionError, e.message
  end
end
