# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_06_15_170437) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "unaccent"
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

  create_table "action_flows", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "event_type"
    t.string "event_condition"
    t.json "event_action"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "community_id"
    t.string "event_condition_query"
    t.string "status", default: "not_deleted"
    t.index ["community_id"], name: "index_action_flows_on_community_id"
    t.index ["title", "community_id"], name: "index_action_flows_on_title_and_community_id", unique: true
  end

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.integer "status", default: 0
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
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activity_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "community_id"
    t.text "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.uuid "reporting_user_id"
  end

  create_table "activity_points", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "article_read", default: 0
    t.integer "comment", default: 0
    t.integer "login", default: 0
    t.integer "referral", default: 0
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "article_shared", default: 0
    t.index ["user_id"], name: "index_activity_points_on_user_id"
  end

  create_table "amenities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "location"
    t.string "hours"
    t.string "invitation_link"
    t.uuid "user_id", null: false
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_amenities_on_community_id"
    t.index ["user_id"], name: "index_amenities_on_user_id"
  end
  create_table "assignee_notes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "note_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "reminder_time"
    t.string "reminder_job_id"
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
    t.integer "total_clicked", default: 0
    t.string "campaign_type", default: "sms", null: false
    t.string "subject"
    t.string "pre_header"
    t.string "template_style"
    t.integer "status", default: 0
    t.integer "message_count", default: 0
    t.boolean "include_reply_link", default: false
    t.uuid "email_templates_id"
    t.integer "total_opened", default: 0
    t.index ["campaign_type"], name: "index_campaigns_on_campaign_type"
    t.index ["community_id", "status"], name: "index_campaigns_on_community_id_and_status"
    t.index ["community_id"], name: "index_campaigns_on_community_id"
    t.index ["email_templates_id"], name: "index_campaigns_on_email_templates_id"
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "field_name"
    t.string "description"
    t.integer "order"
    t.boolean "header_visible"
    t.text "rendered_text"
    t.boolean "general", default: false
    t.uuid "form_property_id"
    t.uuid "form_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "display_condition"
    t.index ["form_id"], name: "index_categories_on_form_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "discussion_id"
    t.string "status"
    t.uuid "community_id"
    t.index ["community_id"], name: "index_comments_on_community_id"
    t.index ["status"], name: "index_comments_on_status"
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
    t.string "hostname"
    t.json "support_number"
    t.json "support_email"
    t.json "support_whatsapp"
    t.string "currency"
    t.string "locale"
    t.string "tagline"
    t.string "language"
    t.string "wp_link"
    t.json "features"
    t.json "theme_colors"
    t.string "security_manager"
    t.json "social_links"
    t.json "banking_details"
    t.json "community_required_fields"
    t.json "menu_items"
    t.uuid "sub_administrator_id"
    t.string "sms_phone_numbers", default: [], array: true
    t.string "emergency_call_number"
    t.string "ga_id"
    t.string "domains", default: [], array: true
    t.integer "hotjar"
    t.json "lead_monthly_targets"
    t.json "payment_keys"
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
    t.string "status", default: "valid"
    t.integer "tag", default: 0
    t.index ["community_id"], name: "index_discussions_on_community_id"
    t.index ["status"], name: "index_discussions_on_status"
    t.index ["user_id"], name: "index_discussions_on_user_id"
  end

  create_table "email_templates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "subject"
    t.text "body"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "template_variables"
    t.json "data"
    t.string "tag"
    t.index ["community_id"], name: "index_email_templates_on_community_id"
    t.index ["name", "community_id"], name: "index_email_templates_on_name_and_community_id", unique: true
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
    t.datetime "visitation_date"
    t.string "start_time"
    t.string "end_time"
    t.string "company_name"
    t.string "occurs_on", default: [], array: true
    t.datetime "visit_end_date"
    t.string "email"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.boolean "is_guest", default: false
    t.integer "entry_request_state", default: 0
    t.uuid "revoker_id"
    t.datetime "revoked_at"
    t.uuid "guest_id"
    t.integer "status", default: 0
    t.datetime "exited_at"
  end

  create_table "entry_times", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "visitation_date"
    t.datetime "visit_end_date"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.string "occurs_on", default: [], array: true
    t.uuid "visitable_id"
    t.string "visitable_type"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_entry_times_on_community_id"
    t.index ["visitable_id", "visitable_type"], name: "index_entry_times_on_visitable_id_and_visitable_type", unique: true
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
    t.uuid "community_id"
    t.index ["community_id"], name: "index_feedbacks_on_community_id"
  end

  create_table "form_properties", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "order"
    t.string "field_name"
    t.integer "field_type"
    t.boolean "required", default: false
    t.string "short_desc"
    t.string "long_desc"
    t.boolean "admin_use", default: false
    t.uuid "form_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "field_value"
    t.uuid "category_id"
    t.uuid "grouping_id", default: -> { "gen_random_uuid()" }
    t.index ["category_id"], name: "index_form_properties_on_category_id"
    t.index ["form_id"], name: "index_form_properties_on_form_id"
  end

  create_table "form_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "form_id", null: false
    t.integer "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "status_updated_by_id"
    t.boolean "has_agreed_to_terms"
    t.index ["form_id"], name: "index_form_users_on_form_id"
    t.index ["status_updated_by_id"], name: "index_form_users_on_status_updated_by_id"
    t.index ["user_id"], name: "index_form_users_on_user_id"
  end

  create_table "forms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "community_id", null: false
    t.datetime "expires_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.text "description"
    t.boolean "multiple_submissions_allowed"
    t.integer "version_number", default: 1
    t.uuid "grouping_id"
    t.boolean "preview"
    t.string "roles", default: [], array: true
    t.boolean "is_public"
    t.boolean "has_terms_and_conditions"
    t.index ["community_id"], name: "index_forms_on_community_id"
  end

  create_table "import_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "file_name"
    t.boolean "failed", default: false
    t.json "import_errors"
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_import_logs_on_community_id"
    t.index ["user_id"], name: "index_import_logs_on_user_id"
  end

  create_table "invites", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "host_id"
    t.uuid "guest_id"
    t.datetime "revoked_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "entry_request_id"
    t.integer "status", default: 0
    t.index ["entry_request_id"], name: "index_invites_on_entry_request_id"
    t.index ["host_id", "guest_id"], name: "index_invites_on_host_id_and_guest_id", unique: true
  end

  create_table "invoices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "land_parcel_id", null: false
    t.uuid "community_id", null: false
    t.datetime "due_date"
    t.decimal "amount", precision: 11, scale: 2
    t.integer "status"
    t.string "description"
    t.string "note"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.uuid "created_by_id"
    t.decimal "pending_amount", precision: 11, scale: 2
    t.integer "invoice_number"
    t.boolean "autogenerated", default: false
    t.uuid "payment_plan_id"
    t.index ["community_id"], name: "index_invoices_on_community_id"
    t.index ["created_by_id"], name: "index_invoices_on_created_by_id"
    t.index ["land_parcel_id"], name: "index_invoices_on_land_parcel_id"
    t.index ["payment_plan_id"], name: "index_invoices_on_payment_plan_id"
    t.index ["user_id"], name: "index_invoices_on_user_id"
  end

  create_table "labels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "short_desc"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "description"
    t.string "color", default: "#f07030"
    t.string "status", default: "active"
    t.string "grouping_name"
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
    t.decimal "long_x", precision: 10, scale: 6
    t.decimal "lat_y", precision: 10, scale: 6
    t.json "geom"
    t.integer "status", default: 0
    t.boolean "is_poi", default: false
    t.integer "object_type", default: 0
    t.uuid "house_land_parcel_id"
    t.index ["community_id"], name: "index_land_parcels_on_community_id"
    t.index ["parcel_number"], name: "index_land_parcels_on_parcel_number", unique: true
    t.index ["status"], name: "index_land_parcels_on_status"
  end

  create_table "lead_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "log_type"
    t.uuid "acting_user_id"
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "amount", precision: 11, scale: 2, default: "0.0"
    t.decimal "deal_size", precision: 11, scale: 2, default: "0.0"
    t.decimal "investment_target", precision: 11, scale: 2, default: "0.0"
    t.index ["community_id"], name: "index_lead_logs_on_community_id"
    t.index ["user_id"], name: "index_lead_logs_on_user_id"
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
    t.uuid "note_id"
    t.index ["campaign_id"], name: "index_messages_on_campaign_id"
    t.index ["note_id"], name: "index_messages_on_note_id"
  end

  create_table "note_comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "body"
    t.uuid "note_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status"
    t.boolean "reply_required", default: false
    t.datetime "replied_at"
    t.uuid "grouping_id"
    t.uuid "reply_from_id"
    t.string "tagged_documents", default: [], array: true
    t.boolean "send_to_resident"
    t.index ["note_id"], name: "index_note_comments_on_note_id"
    t.index ["user_id"], name: "index_note_comments_on_user_id"
  end

  create_table "note_histories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "attr_changed"
    t.string "initial_value"
    t.string "updated_value"
    t.string "action"
    t.string "note_entity_type"
    t.uuid "note_entity_id"
    t.uuid "note_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["note_entity_type", "note_entity_id"], name: "index_note_histories_on_note_entity_type_and_note_entity_id"
    t.index ["note_id"], name: "index_note_histories_on_note_id"
    t.index ["user_id"], name: "index_note_histories_on_user_id"
  end

  create_table "note_lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "process_id"
    t.integer "status", default: 0
    t.index ["community_id"], name: "index_note_lists_on_community_id"
    t.index ["name", "community_id"], name: "index_note_lists_on_name_and_community_id", unique: true
    t.index ["process_id"], name: "index_note_lists_on_process_id"
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
    t.text "description"
    t.uuid "form_user_id"
    t.boolean "autogenerated", default: false
    t.uuid "parent_note_id"
    t.datetime "completed_at"
    t.uuid "current_step"
    t.string "current_step_body"
    t.integer "status", default: 0
    t.integer "order", default: 1
    t.uuid "note_list_id"
    t.index ["form_user_id"], name: "index_notes_on_form_user_id"
    t.index ["note_list_id"], name: "index_notes_on_note_list_id"
    t.index ["parent_note_id"], name: "index_notes_on_parent_note_id"
  end

  create_table "notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "seen_at"
    t.string "notifable_type"
    t.uuid "notifable_id"
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "description"
    t.uuid "community_id"
    t.integer "category"
    t.index ["community_id"], name: "index_notifications_on_community_id"
    t.index ["notifable_type", "notifable_id"], name: "index_notifications_on_notifable_type_and_notifable_id"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "payment_invoices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "invoice_id", null: false
    t.uuid "payment_id", null: false
    t.uuid "wallet_transaction_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["invoice_id"], name: "index_payment_invoices_on_invoice_id"
    t.index ["payment_id", "invoice_id"], name: "index_payment_invoices_on_payment_id_and_invoice_id", unique: true
    t.index ["payment_id"], name: "index_payment_invoices_on_payment_id"
    t.index ["wallet_transaction_id"], name: "index_payment_invoices_on_wallet_transaction_id"
  end

  create_table "payment_plans", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "land_parcel_id", null: false
    t.integer "plan_type"
    t.datetime "start_date"
    t.integer "status"
    t.decimal "percentage", precision: 11, scale: 2
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "generated", default: false
    t.decimal "plot_balance", precision: 11, scale: 2, default: "0.0"
    t.decimal "total_amount", precision: 11, scale: 2
    t.integer "duration"
    t.decimal "pending_balance", precision: 11, scale: 2, default: "0.0"
    t.decimal "installment_amount", precision: 11, scale: 2
    t.integer "payment_day", default: 1
    t.integer "frequency"
    t.boolean "renewable", default: true
    t.uuid "renewed_plan_id"
    t.index ["land_parcel_id"], name: "index_payment_plans_on_land_parcel_id"
    t.index ["user_id"], name: "index_payment_plans_on_user_id"
  end

  create_table "payments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "invoice_id"
    t.string "payment_type"
    t.decimal "amount", precision: 11, scale: 2
    t.integer "payment_status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "bank_name"
    t.string "cheque_number"
    t.uuid "community_id", default: "ec7625ee-0bfe-4dcb-9a37-831fc77fa302", null: false
    t.index ["community_id"], name: "index_payments_on_community_id"
    t.index ["invoice_id"], name: "index_payments_on_invoice_id"
    t.index ["user_id"], name: "index_payments_on_user_id"
  end

  create_table "permissions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "module"
    t.json "permissions"
    t.uuid "role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["module", "role_id"], name: "index_permissions_on_module_and_role_id", unique: true
    t.index ["role_id"], name: "index_permissions_on_role_id"
  end

  create_table "plan_ownerships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "payment_plan_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["payment_plan_id"], name: "index_plan_ownerships_on_payment_plan_id"
    t.index ["user_id", "payment_plan_id"], name: "index_plan_ownerships_on_user_id_and_payment_plan_id", unique: true
    t.index ["user_id"], name: "index_plan_ownerships_on_user_id"
  end

  create_table "plan_payments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "amount"
    t.integer "status"
    t.uuid "transaction_id", null: false
    t.uuid "user_id", null: false
    t.uuid "community_id", null: false
    t.uuid "payment_plan_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "manual_receipt_number"
    t.string "automated_receipt_number"
    t.string "note"
    t.index ["community_id"], name: "index_plan_payments_on_community_id"
    t.index ["payment_plan_id"], name: "index_plan_payments_on_payment_plan_id"
    t.index ["transaction_id"], name: "index_plan_payments_on_transaction_id"
    t.index ["user_id"], name: "index_plan_payments_on_user_id"
  end

  create_table "post_tag_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "post_tag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["post_tag_id"], name: "index_post_tag_users_on_post_tag_id"
    t.index ["user_id", "post_tag_id"], name: "index_post_tag_users_on_user_id_and_post_tag_id", unique: true
    t.index ["user_id"], name: "index_post_tag_users_on_user_id"
  end

  create_table "post_tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "community_id"
    t.index ["community_id"], name: "index_post_tags_on_community_id"
    t.index ["name"], name: "index_post_tags_on_name", unique: true
  end

  create_table "posts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content"
    t.integer "status", default: 0
    t.uuid "discussion_id", null: false
    t.uuid "user_id", null: false
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "accessibility"
    t.index ["community_id"], name: "index_posts_on_community_id"
    t.index ["discussion_id"], name: "index_posts_on_discussion_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "processes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "process_type"
    t.string "name"
    t.uuid "community_id", null: false
    t.uuid "form_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.index ["community_id"], name: "index_processes_on_community_id"
    t.index ["form_id"], name: "index_processes_on_form_id"
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "community_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_roles_on_community_id"
    t.index ["name", "community_id"], name: "index_roles_on_name_and_community_id", unique: true
  end

  create_table "showrooms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
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

  create_table "subscription_plans", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "plan_type"
    t.integer "status", default: 0
    t.date "start_date"
    t.date "end_date"
    t.decimal "amount"
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_subscription_plans_on_community_id"
    t.index ["start_date", "end_date", "amount"], name: "index_subscription_plans_on_start_date_and_end_date_and_amount", unique: true
  end

  create_table "substatus_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "start_date"
    t.datetime "stop_date"
    t.string "previous_status"
    t.string "new_status"
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "updated_by_id"
    t.index ["community_id"], name: "index_substatus_logs_on_community_id"
    t.index ["updated_by_id"], name: "index_substatus_logs_on_updated_by_id"
    t.index ["user_id"], name: "index_substatus_logs_on_user_id"
  end

  create_table "time_sheets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "shift_start_event_log_id"
    t.uuid "shift_end_event_log_id"
    t.uuid "user_id"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "community_id"
    t.index ["community_id"], name: "index_time_sheets_on_community_id"
    t.index ["shift_end_event_log_id"], name: "index_time_sheets_on_shift_end_event_log_id"
    t.index ["shift_start_event_log_id"], name: "index_time_sheets_on_shift_start_event_log_id"
    t.index ["user_id"], name: "index_time_sheets_on_user_id"
  end

  create_table "transaction_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "paid_amount"
    t.string "currency"
    t.decimal "amount"
    t.string "invoice_number"
    t.string "transaction_id"
    t.string "transaction_ref"
    t.string "description"
    t.string "account_name"
    t.integer "integration_type", default: 0
    t.uuid "user_id", null: false
    t.uuid "community_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_transaction_logs_on_community_id"
    t.index ["user_id"], name: "index_transaction_logs_on_user_id"
  end

  create_table "transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "source"
    t.integer "status"
    t.decimal "amount"
    t.string "receipt_number"
    t.datetime "originally_created_at"
    t.string "transaction_number"
    t.string "cheque_number"
    t.string "bank_name"
    t.uuid "depositor_id"
    t.uuid "community_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["community_id"], name: "index_transactions_on_community_id"
    t.index ["depositor_id"], name: "index_transactions_on_depositor_id"
    t.index ["transaction_number"], name: "index_transactions_on_transaction_number", unique: true
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "user_form_properties", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "form_property_id", null: false
    t.uuid "form_user_id", null: false
    t.uuid "user_id"
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_property_id"], name: "index_user_form_properties_on_form_property_id"
    t.index ["form_user_id"], name: "index_user_form_properties_on_form_user_id"
    t.index ["user_id"], name: "index_user_form_properties_on_user_id"
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
    t.integer "sub_status"
    t.string "address"
    t.uuid "latest_substatus_id"
    t.string "ext_ref_id"
    t.uuid "role_id", null: false
    t.string "region"
    t.string "title"
    t.string "linkedin_url"
    t.string "company_name"
    t.string "country"
    t.string "company_description"
    t.string "company_linkedin"
    t.string "company_website"
    t.string "company_employees"
    t.string "company_annual_revenue"
    t.string "company_contacted"
    t.string "industry_sub_sector"
    t.string "industry_business_activity"
    t.string "industry"
    t.string "level_of_internationalization"
    t.string "lead_temperature"
    t.string "lead_status"
    t.string "lead_source"
    t.string "lead_owner"
    t.string "lead_type"
    t.string "client_category"
    t.text "next_steps"
    t.datetime "last_contact_date"
    t.string "modified_by"
    t.datetime "first_contact_date"
    t.string "created_by"
    t.string "relevant_link"
    t.jsonb "contact_details"
    t.string "african_presence"
    t.string "task_id"
    t.string "capex_amount"
    t.string "jobs_created"
    t.string "jobs_timeline"
    t.datetime "kick_off_date"
    t.string "investment_size"
    t.string "investment_timeline"
    t.string "decision_timeline"
    t.integer "status", default: 0
    t.string "division"
    t.index ["community_id", "email"], name: "index_users_on_community_id_and_email", unique: true
    t.index ["latest_substatus_id"], name: "index_users_on_latest_substatus_id"
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["sub_status"], name: "index_users_on_sub_status"
    t.index ["uid", "provider", "community_id"], name: "index_users_on_uid_and_provider_and_community_id", unique: true
  end

  create_table "valuations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "start_date"
    t.decimal "amount", precision: 11, scale: 2
    t.uuid "land_parcel_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["land_parcel_id"], name: "index_valuations_on_land_parcel_id"
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

  create_table "wallet_transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "source"
    t.string "destination"
    t.decimal "amount", precision: 11, scale: 2
    t.integer "status"
    t.string "bank_name"
    t.string "cheque_number"
    t.decimal "current_wallet_balance", precision: 11, scale: 2
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "community_id", default: "ec7625ee-0bfe-4dcb-9a37-831fc77fa302", null: false
    t.string "transaction_number"
    t.uuid "depositor_id"
    t.string "receipt_number"
    t.datetime "originally_created_at"
    t.uuid "payment_plan_id"
    t.json "settled_invoices"
    t.decimal "current_pending_plot_balance", precision: 11, scale: 2
    t.index ["community_id"], name: "index_wallet_transactions_on_community_id"
    t.index ["depositor_id"], name: "index_wallet_transactions_on_depositor_id"
    t.index ["payment_plan_id"], name: "index_wallet_transactions_on_payment_plan_id"
    t.index ["transaction_number"], name: "index_wallet_transactions_on_transaction_number", unique: true
    t.index ["user_id"], name: "index_wallet_transactions_on_user_id"
  end

  create_table "wallets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "currency"
    t.decimal "balance", precision: 11, scale: 2
    t.decimal "pending_balance", precision: 11, scale: 2
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.decimal "unallocated_funds", precision: 11, scale: 2, default: "0.0"
    t.index ["user_id"], name: "index_wallets_on_user_id"
  end

  add_foreign_key "accounts", "communities"
  add_foreign_key "accounts", "users"
  add_foreign_key "action_flows", "communities"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activity_points", "users"
  add_foreign_key "amenities", "communities"
  add_foreign_key "amenities", "users"
  add_foreign_key "assignee_notes", "notes"
  add_foreign_key "assignee_notes", "users"
  add_foreign_key "businesses", "communities"
  add_foreign_key "businesses", "users"
  add_foreign_key "campaign_labels", "campaigns"
  add_foreign_key "campaign_labels", "labels"
  add_foreign_key "campaigns", "communities"
  add_foreign_key "campaigns", "email_templates", column: "email_templates_id"
  add_foreign_key "categories", "forms"
  add_foreign_key "comments", "communities"
  add_foreign_key "contact_infos", "users"
  add_foreign_key "discussion_users", "discussions"
  add_foreign_key "discussion_users", "users"
  add_foreign_key "discussions", "communities"
  add_foreign_key "discussions", "users"
  add_foreign_key "email_templates", "communities"
  add_foreign_key "entry_times", "communities"
  add_foreign_key "feedbacks", "communities"
  add_foreign_key "form_properties", "categories"
  add_foreign_key "form_properties", "forms"
  add_foreign_key "form_users", "forms"
  add_foreign_key "form_users", "users"
  add_foreign_key "form_users", "users", column: "status_updated_by_id"
  add_foreign_key "forms", "communities"
  add_foreign_key "import_logs", "communities"
  add_foreign_key "import_logs", "users"
  add_foreign_key "invites", "entry_requests"
  add_foreign_key "invoices", "communities"
  add_foreign_key "invoices", "land_parcels"
  add_foreign_key "invoices", "payment_plans"
  add_foreign_key "invoices", "users"
  add_foreign_key "labels", "communities"
  add_foreign_key "land_parcel_accounts", "accounts"
  add_foreign_key "land_parcel_accounts", "land_parcels"
  add_foreign_key "land_parcels", "communities"
  add_foreign_key "lead_logs", "communities"
  add_foreign_key "lead_logs", "users"
  add_foreign_key "note_comments", "notes"
  add_foreign_key "note_comments", "users"
  add_foreign_key "note_histories", "notes"
  add_foreign_key "note_histories", "users"
  add_foreign_key "note_lists", "communities"
  add_foreign_key "note_lists", "processes"
  add_foreign_key "notes", "form_users"
  add_foreign_key "notes", "note_lists"
  add_foreign_key "notes", "notes", column: "parent_note_id"
  add_foreign_key "notifications", "communities"
  add_foreign_key "notifications", "users"
  add_foreign_key "payment_invoices", "invoices"
  add_foreign_key "payment_invoices", "payments"
  add_foreign_key "payment_invoices", "wallet_transactions"
  add_foreign_key "payment_plans", "land_parcels"
  add_foreign_key "payment_plans", "users"
  add_foreign_key "payments", "communities"
  add_foreign_key "payments", "invoices"
  add_foreign_key "payments", "users"
  add_foreign_key "permissions", "roles"
  add_foreign_key "plan_ownerships", "payment_plans"
  add_foreign_key "plan_ownerships", "users"
  add_foreign_key "plan_payments", "communities"
  add_foreign_key "plan_payments", "payment_plans"
  add_foreign_key "plan_payments", "transactions"
  add_foreign_key "plan_payments", "users"
  add_foreign_key "post_tag_users", "post_tags"
  add_foreign_key "post_tag_users", "users"
  add_foreign_key "post_tags", "communities"
  add_foreign_key "posts", "communities"
  add_foreign_key "posts", "discussions"
  add_foreign_key "posts", "users"
  add_foreign_key "processes", "communities"
  add_foreign_key "processes", "forms"
  add_foreign_key "roles", "communities"
  add_foreign_key "subscription_plans", "communities"
  add_foreign_key "substatus_logs", "communities"
  add_foreign_key "substatus_logs", "users"
  add_foreign_key "substatus_logs", "users", column: "updated_by_id"
  add_foreign_key "time_sheets", "communities"
  add_foreign_key "transaction_logs", "communities"
  add_foreign_key "transaction_logs", "users"
  add_foreign_key "transactions", "communities"
  add_foreign_key "transactions", "users"
  add_foreign_key "user_form_properties", "form_properties"
  add_foreign_key "user_form_properties", "form_users"
  add_foreign_key "user_form_properties", "users"
  add_foreign_key "user_labels", "labels"
  add_foreign_key "user_labels", "users"
  add_foreign_key "users", "roles"
  add_foreign_key "valuations", "land_parcels"
  add_foreign_key "wallet_transactions", "communities"
  add_foreign_key "wallet_transactions", "payment_plans"
  add_foreign_key "wallet_transactions", "users"
  add_foreign_key "wallets", "users"
end
