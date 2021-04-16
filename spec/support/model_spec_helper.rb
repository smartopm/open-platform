# frozen_string_literal: true

# Manages helper methods for unit spec.
module ModelSpecHelper
  # Creates wallet transaction and settle pending invoices.
  # Uses Mutation WalletTransactionCreate.
  #
  # @param args [Hash]
  # @option args [User] user
  # @option args [Float] amount
  # @option args [String] source
  # @option args [String] LandParcel#id
  # @option args [User] admin
  #
  # @return [void]
  def create_transaction(args = {})
    user = args[:user]
    variables = {
      userId: user.id,
      amount: args[:amount],
      source: args[:source],
      landParcelId: args[:land_parcel_id],
    }
    context = { current_user: args[:admin], site_community: user.community }
    DoubleGdpSchema.execute(txn_create_mutation, variables: variables, context: context).as_json
  end

  private

  # Wallet Transaction create mutation.
  #
  # @return [String]
  def txn_create_mutation
    <<~GQL
      mutation walletTransactionCreate (
        $userId: ID!,
        $amount: Float!,
        $source: String!,
        $landParcelId: ID!    
      ) {
        walletTransactionCreate(
          userId: $userId,
          amount: $amount,
          source: $source,
          landParcelId: $landParcelId
        ){
          walletTransaction {
            id
          }
        }
      }
    GQL
  end
end
