# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_14_122111) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "accounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.string "full_name"
    t.string "address1"
    t.string "address2"
    t.string "city"
    t.string "postal_code"
    t.string "state_province"
    t.string "country"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_accounts_on_community_id"
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "activity_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id"
    t.text "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.uuid "reporting_user_id"
  end

  create_table "assignee_notes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "note_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["note_id"], name: "index_assignee_notes_on_note_id"
    t.index ["user_id", "note_id"], name: "index_assignee_notes_on_user_id_and_note_id", unique: true
    t.index ["user_id"], name: "index_assignee_notes_on_user_id"
  end

  create_table "businesses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.string "name"
    t.string "status"
    t.string "home_url"
    t.string "category"
    t.text "description"
    t.string "image_url"
    t.string "email"
    t.string "phone_number"
    t.string "address"
    t.string "operation_hours"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "links"
    t.index ["community_id"], name: "index_businesses_on_community_id"
    t.index ["user_id"], name: "index_businesses_on_user_id"
  end

  create_table "campaign_labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "campaign_id", null: false
    t.uuid "label_id", null: false
    t.index ["campaign_id", "label_id"], name: "index_campaign_labels_on_campaign_id_and_label_id", unique: true
    t.index ["campaign_id"], name: "index_campaign_labels_on_campaign_id"
    t.index ["label_id"], name: "index_campaign_labels_on_label_id"
  end

  create_table "campaigns", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id", null: false
    t.string "name"
    t.string "message"
    t.text "user_id_list"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "batch_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "total_sent"
    t.integer "total_clicked"
    t.string "campaign_type", default: "sms", null: false
    t.string "subject"
    t.string "pre_header"
    t.string "template_style"
    t.integer "status", default: 0
    t.integer "message_count", default: 0
    t.index ["campaign_type"], name: "index_campaigns_on_campaign_type"
    t.index ["community_id"], name: "index_campaigns_on_community_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "discussion_id"
  end

  create_table "communities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "google_domain"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.string "logo_url"
    t.string "slack_webhook_url"
    t.string "timezone"
    t.string "default_users", default: [], array: true
    t.json "templates"
    t.index ["slug"], name: "index_communities_on_slug", unique: true
  end

  create_table "contact_infos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "contact_type"
    t.string "info"
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_contact_infos_on_user_id"
  end

  create_table "discussion_users", force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "discussion_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["discussion_id"], name: "index_discussion_users_on_discussion_id"
    t.index ["user_id", "discussion_id"], name: "index_discussion_users_on_user_id_and_discussion_id", unique: true
    t.index ["user_id"], name: "index_discussion_users_on_user_id"
  end

  create_table "discussions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.text "description"
    t.string "title"
    t.string "post_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_discussions_on_community_id"
    t.index ["user_id"], name: "index_discussions_on_user_id"
  end

  create_table "entry_requests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "community_id"
    t.string "name"
    t.string "nrc"
    t.string "phone_number"
    t.string "vehicle_plate"
    t.string "reason"
    t.string "other_reason"
    t.boolean "concern_flag"
    t.integer "granted_state"
    t.uuid "grantor_id"
    t.datetime "granted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "source"
    t.boolean "acknowledged"
  end

  create_table "event_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id"
    t.uuid "acting_user_id"
    t.uuid "ref_id"
    t.string "ref_type"
    t.string "subject"
    t.json "data"
    t.datetime "created_at"
    t.index ["ref_id"], name: "index_event_logs_on_ref_id"
  end

  create_table "feedbacks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "user_id"
    t.boolean "is_thumbs_up"
    t.datetime "date"
    t.string "review"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "short_desc"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_labels_on_community_id"
  end

  create_table "land_parcel_accounts", id: false, force: :cascade do |t|
    t.uuid "land_parcel_id", null: false
    t.uuid "account_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account_id"], name: "index_land_parcel_accounts_on_account_id"
    t.index ["land_parcel_id", "account_id"], name: "index_land_parcel_accounts_on_land_parcel_id_and_account_id", unique: true
    t.index ["land_parcel_id"], name: "index_land_parcel_accounts_on_land_parcel_id"
  end

  create_table "land_parcels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id", null: false
    t.string "parcel_number"
    t.string "address1"
    t.string "address2"
    t.string "city"
    t.string "postal_code"
    t.string "state_province"
    t.string "country"
    t.string "parcel_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_land_parcels_on_community_id"
  end

  create_table "messages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "receiver"
    t.text "message"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.uuid "sender_id"
    t.boolean "is_read"
    t.datetime "read_at"
    t.uuid "campaign_id"
    t.string "source_system_id"
    t.string "category"
    t.index ["campaign_id"], name: "index_messages_on_campaign_id"
  end

  create_table "notes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "author_id"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "flagged"
    t.boolean "completed"
    t.datetime "due_date"
    t.string "category"
    t.uuid "assigned_to"
    t.uuid "community_id"
  end

  create_table "showrooms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "userId"
    t.string "name"
    t.string "email"
    t.string "home_address"
    t.string "phone_number"
    t.string "nrc"
    t.string "reason"
    t.string "source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "time_sheets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "shift_start_event_log_id"
    t.uuid "shift_end_event_log_id"
    t.uuid "user_id"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shift_end_event_log_id"], name: "index_time_sheets_on_shift_end_event_log_id"
    t.index ["shift_start_event_log_id"], name: "index_time_sheets_on_shift_start_event_log_id"
    t.index ["user_id"], name: "index_time_sheets_on_user_id"
  end

  create_table "user_labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "label_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["label_id"], name: "index_user_labels_on_label_id"
    t.index ["user_id", "label_id"], name: "index_user_labels_on_user_id_and_label_id", unique: true
    t.index ["user_id"], name: "index_user_labels_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "provider"
    t.string "uid"
    t.string "token"
    t.boolean "oauth_expires"
    t.datetime "oauth_expires_at"
    t.string "refresh_token"
    t.string "image_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone_number"
    t.string "phone_token"
    t.datetime "phone_token_expires_at"
    t.string "user_type"
    t.string "request_reason"
    t.string "request_status"
    t.text "request_note"
    t.string "vehicle"
    t.uuid "community_id"
    t.datetime "last_activity_at"
    t.string "state"
    t.datetime "expires_at"
    t.string "source"
    t.string "stage"
    t.uuid "owner_id"
    t.string "id_number"
    t.datetime "followup_at"
    t.index ["community_id", "email"], name: "index_users_on_community_id_and_email", unique: true
    t.index ["uid", "provider", "community_id"], name: "index_users_on_uid_and_provider_and_community_id", unique: true
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.uuid "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "accounts", "communities"
  add_foreign_key "accounts", "users"
  add_foreign_key "assignee_notes", "notes"
  add_foreign_key "assignee_notes", "users"
  add_foreign_key "businesses", "communities"
  add_foreign_key "businesses", "users"
  add_foreign_key "campaign_labels", "campaigns"
  add_foreign_key "campaign_labels", "labels"
  add_foreign_key "campaigns", "communities"
  add_foreign_key "contact_infos", "users"
  add_foreign_key "discussion_users", "discussions"
  add_foreign_key "discussion_users", "users"
  add_foreign_key "discussions", "communities"
  add_foreign_key "discussions", "users"
  add_foreign_key "labels", "communities"
  add_foreign_key "land_parcel_accounts", "accounts"
  add_foreign_key "land_parcel_accounts", "land_parcels"
  add_foreign_key "land_parcels", "communities"
  add_foreign_key "user_labels", "labels"
  add_foreign_key "user_labels", "users"
end
