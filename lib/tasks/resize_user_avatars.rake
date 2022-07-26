# frozen_string_literal: true

desc 'resize avatars uploaded by users'
task resize_avatars: :environment do
  results = {}
  ActiveRecord::Base.transaction do
    ActiveStorage::Attachment.where(
      record_type: "Users::User",
      name: "avatar"
    ).find_each do |attachment|
      puts "Updating attachment: #{attachment.id}..."
  
      resized = attachment.open do |file|
        ImageProcessing::MiniMagick
          .source(file)
          .resize_to_limit!(224, 224)
      end

      attachment.record&.avatar&.attach(io: resized, filename: attachment.filename, content_type: attachment.content_type)
    end
  end

  puts "Done."
end
