# frozen_string_literal: true

# ActivityLog controller
class ActivityLogsController < ApplicationController
  before_action :authenticate_member!
  before_action :set_community_and_member, only: %i[index create]

  def index
    if @member
      @activity_logs = @member.activity_logs
    elsif @community
      @activity_logs = @community.activity_logs
    end
  end

  def show
    @activity_log = ActivityLog.find(params[:id])
  end

  def create
    @member = Member.find(params[:activity_log][:member_id])
    ActivityLog.create(reporting_member_id: current_member.id,
                       member_id: @member.id_card_token)
    flash[:notice] = 'Entry logged!'
    redirect_to member_id_verify_path(token: @member.id_card_token)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_community_and_member
    @community = Community.find(params[:community_id]) if params[:community_id]
    @member = Member.find(params[:member_id]) if params[:member_id]
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def member_params
    params.require(:activity_log).permit(:member_id, :community_id)
  end
end
