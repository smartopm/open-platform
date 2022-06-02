# frozen_string_literal: true

require 'host_env'

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentCreate < BaseMutation
      argument :note_id, ID, required: true
      argument :body, String, required: true
      argument :reply_required, Boolean, required: false
      argument :reply_from_id, ID, required: false
      argument :grouping_id, ID, required: false

      field :note_comment, Types::NoteCommentType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          update_previous_comment!(vals[:note_id], vals[:grouping_id])

          comment = context[:current_user].note_comments.new(vals)
          comment.status = 'active'
          comment.save!

          if comment.grouping_id.nil? && comment.reply_required
            comment.update!(grouping_id: comment.id)
          end

          if vals[:reply_required]
            send_email_notification(comment)
            notify_when_reply_requested(comment)
          end

          comment.record_note_history(context[:current_user])
          { note_comment: comment }
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def update_previous_comment!(note_id, grouping_id)
        return unless grouping_id

        note = Notes::Note.find(note_id)
        note.note_comments.find_by(grouping_id: grouping_id, replied_at: nil).update!(
          replied_at: Time.zone.now,
        )
      end

      # rubocop:disable Layout/LineLength
      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def send_email_notification(comment)
        note = comment.note
        template = context[:site_community].email_templates.find_by(name: 'Generic Template')

        return if comment.reply_from.email.nil? || template.nil?

        base_url = HostEnv.base_url(context[:site_community])
        path = "/processes/drc/projects/#{note.id}?tab=processes&detailTab=comments&replying_discussion=#{comment.grouping_id}"
        action_url = "https://#{base_url}#{path}"
        email_body = I18n.t('email_template.comment_reply.body',
                            note_body: note.body,
                            note_due_at: (note.due_date&.strftime('%Y-%m-%d') || 'Never'),
                            user_name: comment.user.name,
                            comment_created_at: comment.created_at.strftime('%Y-%m-%d'))
        email_subject = I18n.t('email_template.comment_reply.subject', user_name: comment.user.name)
        template_data = [
          { key: '%action_url%', value: action_url },
          { key: '%action%', value: I18n.t('email_template.comment_reply.action') },
          { key: '%body%', value: email_body },
          { key: '%title%', value: I18n.t('email_template.comment_reply.title') },
        ]
        EmailMsg.send_mail_from_db(
          email: comment.reply_from.email,
          template: template,
          template_data: template_data,
          email_subject: email_subject,
        )
      end
      # rubocop:enable Layout/LineLength
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      def notify_when_reply_requested(comment)
        description = I18n.t('notification_description.reply_requested',
                             user: context[:current_user].name)
        create_notification(comment, description, :reply_requested, comment.reply_from_id)
      end

      def create_notification(comment, description, category, user_id)
        NotificationCreateJob.perform_now(community_id: context[:site_community].id,
                                          notifable_id: comment.id,
                                          notifable_type: comment.class.name,
                                          description: description,
                                          category: category,
                                          user_id: user_id)
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_create_note_comment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
