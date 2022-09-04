# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Community.create!(
  name: 'DoubleGDP',
  slug: "dgdp",
  currency: "zambian_kwacha",
  logo_url: "//nkwashi_white_logo_transparent.png",
  domains: ['localhost'],
  theme_colors: {"primaryColor" => "#53A2BE", "secondaryColor" => "#1E4785"}
)
