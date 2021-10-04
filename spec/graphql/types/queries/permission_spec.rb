# # frozen_string_literal: true

# require 'rails_helper'

# RSpec.describe Types::Queries::Permission do
#   describe 'permission queries' do
#     let!(:site_worker) { create(:site_worker) }
#     let(:notes_query) do
#       %(query {
#             permissions {
#                   category
#                   description
#                   flagged
#                   body
#                   createdAt
#                   userId
#                   user {
#                       name
#                       id
#                   }
#               }
#           })
#     end

#     let(:permissions_object) { {
#       note: { admin: { permissions: %i[can_create_note can_update_note] } },
#     }}

#     before do
#       allow_any_instance_of(ApplicationPolicy).to receive(:permission_list).and_return(:permissions_object)
#     end


#     it 'should retrieve list of notes' do
#       result = DoubleGdpSchema.execute(notes_query, context: {
#                                          current_user: admin,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('data', 'allNotes').length).to eql 2
#       expect(result.dig('data', 'allNotes', 0, 'user', 'id')).to eql admin.id
#       expect(result.dig('data', 'allNotes', 0, 'userId')).to eql admin.id
#     end

#     it 'should raise an error when the current user is null' do
#       result = DoubleGdpSchema.execute(notes_query, context: {
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message'))
#         .to include('Must be logged in to perform this action')
#     end

#     it 'should retrieve list of flagged notes' do
#       result = DoubleGdpSchema.execute(flagged_notes_query, context: {
#                                          current_user: site_worker,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('data', 'flaggedNotes').length).to eql 2
#     end

#     it 'should retrieve list of flagged notes without due date' do
#       variables = { query: 'due_date:nil' }
#       result = DoubleGdpSchema.execute(flagged_notes_query,
#                                        variables: variables,
#                                        context: {
#                                          current_user: site_worker,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message')).to be_nil
#       expect(result.dig('data', 'flaggedNotes').length).to eql 1
#     end

#     it 'should raise unauthorised error when current user is nil' do
#       result = DoubleGdpSchema.execute(flagged_notes_query, context: {
#                                          current_user: nil,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message'))
#         .to include('Must be logged in to perform this action')
#     end

#     it 'should retrieve note by id with site worker as current user' do
#       result = DoubleGdpSchema.execute(note_query, context: {
#                                          current_user: site_worker,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('data', 'task')).not_to be_empty
#     end

#     it 'should raise unauthorised error if request does not have a current user' do
#       result = DoubleGdpSchema.execute(note_query, context: {
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message'))
#         .to include('Must be logged in to perform this action')
#     end

#     it 'should retrieve note comments with site manager as current user' do
#       result = DoubleGdpSchema.execute(note_comments_query, context: {
#                                          current_user: admin,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('data', 'taskComments')).not_to be_empty
#     end

#     it 'should retrieve note comments with site worker as current user' do
#       result = DoubleGdpSchema.execute(note_comments_query, context: {
#                                          current_user: site_worker,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('data', 'taskComments')).not_to be_empty
#     end

#     it 'should raise unautorised error/
#       for retrieve comments when current user is nil' do
#       result = DoubleGdpSchema.execute(note_comments_query, context: {
#                                          current_user: nil,
#                                          site_community: site_worker.community,
#                                        }).as_json
#       expect(result.dig('errors', 0, 'message'))
#         .to include('Must be logged in to perform this action')
#     end
#   end
# end
