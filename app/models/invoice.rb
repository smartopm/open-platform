# frozen_string_literal: true

# Invoice Record
class Invoice < ApplicationRecord
  include SearchCop

  belongs_to :land_parcel
  belongs_to :community
  belongs_to :user
  belongs_to :payment_plan, optional: true
  belongs_to :created_by, class_name: 'User', optional: true

  before_validation :invoice_not_present_for_month, on: :create
  before_create :set_pending_amount
  after_create :collect_payment_from_wallet, if: proc { persisted? }
  after_create :generate_event_log, if: proc { persisted? }
  before_update :modify_status, if: proc { changed_attributes.keys.include?('pending_amount') }
  after_update -> { generate_event_log(:update) }

  has_many :payment_invoices, dependent: :destroy
  has_many :payments, through: :payment_invoices

  enum status: { in_progress: 0, paid: 1, late: 2, cancelled: 3 }
  default_scope { order(created_at: :desc) }

  search_scope :search do
    attributes :status, :invoice_number, :pending_amount, :amount, :created_at, :due_date
    attributes land_parcel: ['land_parcel.parcel_number']
    attributes created_by: ['created_by.name', 'created_by.email', 'created_by.phone_number']
    attributes user: ['user.name']
    attributes email: ['user.email']
    attributes phone_number: ['user.phone_number']
  end

  def collect_payment_from_wallet
    ActiveRecord::Base.transaction do
      cur_payment = settle_amount
      user.wallet.update_balance(amount, 'debit')
      bal = land_parcel.payment_plan&.plot_balance
      land_parcel.payment_plan.update(plot_balance: bal - cur_payment)
      user.wallet.make_payment(self, cur_payment)
    end
  end

  def settle_amount
    pending_amount = amount - land_parcel.payment_plan&.plot_balance.to_i
    return amount - pending_amount if pending_amount.positive?
      
    paid!
    amount
  end

  # rubocop:disable Metrics/MethodLength
  def self.invoice_stat(com)
    Invoice.connection.select_all(
      sanitize_sql("select
        CASE
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date)>= 0
                AND DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date) <= 30 THEN '00-30'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date)>= 31
                AND DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date) <= 45 THEN '31-45'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date)>= 46
                AND DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date) <= 60 THEN '46-60'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - inv.due_date)>= 61 THEN '61+'
        END no_of_days, count(*) as no_of_invoices
        from invoices inv where inv.community_id='#{com}'
        AND inv.status !=1 group by no_of_days"),
    )
  end
  # rubocop:enable Metrics/MethodLength

  def modify_status
    return if pending_amount.positive? || status.eql?('paid')

    paid!
  end

  def generate_event_log(action_type = :create)
    previous_status = ''
    if action_type == :update && saved_changes.key?('status')
      previous_status = saved_changes['status'].first
    end

    created_by&.generate_events(
      'invoice_change',
      self,
      { from_status: previous_status, to_status: status },
    )
  end

  def invoice_not_present_for_month
    return if Invoice.where(
      "extract(month from created_at) = ? AND amount = ? AND land_parcel_id = ?
      AND autogenerated = ?", Time.zone.now.month, amount, land_parcel_id, true
    ).count.zero?

    errors.add(:invoice, 'invoice already generated')
  end

  def set_pending_amount
    self.pending_amount = self.amount
  end
end
