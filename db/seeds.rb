# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

community = Community.create(name: 'Test Community', slug: "dgdp", logo_url: "//nkwashi_white_logo_transparent.png")
mark = User.create(name: 'Mark Percival', email: 'mark1@doublegdp.com',
                   provider: 'google_oauth2',
                   image_url: 'https://lh3.googleusercontent.com/-ong4yo_HRvk/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdHiURdL-7LHJ1e4mrpVEEU_MYgsg/photo.jpg',
                  )

Member.create(user_id: mark.id, community_id: community.id, member_type: 'Contractor', expires_at: 4.weeks.from_now)
