# frozen_string_literal: true

desc 'resize discussion post images upload'
task resize_discussion_posts: :environment do
  ActiveRecord::Base.transaction do
    Discussions::Post.find_each do |post|
      puts "Updating post: #{post.content} images"

      # post is configured to have many images
      post.images.each do |image|
        reprocessed = image.open do |file|
          ImageProcessing::MiniMagick
            .source(file)
            .convert('jpeg')
            .strip
            .resize_to_limit(1200, 900)
            .saver!(quality: 70)
        end

        # delete current image
        post.images.find(image.id).purge

        # replace deleted image with reprocessed one
        post.images.attach(
          io: reprocessed,
          filename: image.filename,
          content_type: 'image/jpeg',
        )
      end
    end
  end

  puts 'Done.'
end
