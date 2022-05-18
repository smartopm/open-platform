/* eslint-disable */
import gql from 'graphql-tag';
import { UserFragment, EntryRequestFragment } from './fragments';

export const CreateUserMutation = gql`
  mutation CreateUserMutation(
    $name: String!
    $email: String
    $phoneNumber: String!
    $userType: String!
    $address: String
    $state: String
    $vehicle: String
    $requestReason: String
    $avatarBlobId: String
    $documentBlobId: String
    $subStatus: String
    $secondaryInfo: JSON
    $extRefId: String
  ) {
    result: userCreate(
      name: $name
      userType: $userType
      email: $email
      phoneNumber: $phoneNumber
      requestReason: $requestReason
      vehicle: $vehicle
      state: $state
      avatarBlobId: $avatarBlobId
      documentBlobId: $documentBlobId
      subStatus: $subStatus
      address: $address
      secondaryInfo: $secondaryInfo
      extRefId: $extRefId
    ) {
      user {
        id
      }
    }
  }
`;
// ${UserFragment.publicFields}

/**
 * @deprecated this is no longer used in favor of this mutations/user.js and should be deleted
 */
export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String!
    $email: String
    $phoneNumber: String
    $userType: String!
    $requestReason: String
    $vehicle: String
    $state: String
    $avatarBlobId: String
    $documentBlobId: String
    $expiresAt: String
    $subStatus: String
    $address: String
    $secondaryInfo: [JSON!]
    $extRefId: String
  ) {
    result: userUpdate(
      id: $id
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      userType: $userType
      requestReason: $requestReason
      vehicle: $vehicle
      state: $state
      avatarBlobId: $avatarBlobId
      documentBlobId: $documentBlobId
      expiresAt: $expiresAt
      subStatus: $subStatus
      address: $address
      secondaryInfo: $secondaryInfo
      extRefId: $extRefId
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`;

export const NonAdminUpdateMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String!
    $avatarBlobId: String
    $address: String
    $secondaryInfo: [JSON!]
  ) {
    result: userUpdate(
      id: $id
      name: $name
      avatarBlobId: $avatarBlobId
      address: $address
      secondaryInfo: $secondaryInfo
    ) {
      user {
        id
      }
    }
  }
`;

export const CreatePendingUserMutation = gql`
  mutation CreatePendingUserMutation(
    $name: String!
    $requestReason: String!
    $userType: String!
    $vehicle: String
  ) {
    result: userCreate(
      name: $name
      requestReason: $requestReason
      vehicle: $vehicle
      userType: $userType
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`;

export const UpdatePendingUserMutation = gql`
  mutation UpdatePendingUserMutation(
    $id: ID!
    $name: String!
    $requestReason: String!
    $vehicle: String
    $userType: String!
  ) {
    result: userUpdate(
      id: $id
      name: $name
      requestReason: $requestReason
      vehicle: $vehicle
      userType: $userType
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`;

export const CreateUpload = gql`
  mutation CreateUpload(
    $filename: String!
    $contentType: String!
    $checksum: String!
    $byteSize: Int!
  ) {
    createUpload(
      input: {
        filename: $filename
        contentType: $contentType
        checksum: $checksum
        byteSize: $byteSize
      }
    ) {
      attachment {
        uploadUrl
        url
        headers
        blobId
        signedBlobId
      }
    }
  }
`;

export const AttachAvatar = gql`
  mutation AttachAvatar($id: ID!, $name: String!, $signedBlobId: String!) {
    userUpdate(id: $id, name: $name, avatarBlobId: $signedBlobId) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`;

export const AddActivityLog = gql`
  mutation ActivityLogMutation($userId: ID!, $timestamp: String, $digital: Boolean, $note: String) {
    activityLogAdd(userId: $userId, timestamp: $timestamp, digital: $digital, note: $note) {
      user {
        id
      }
      status
    }
  }
`;

export const SendOneTimePasscode = gql`
  mutation SendOneTimePasscode($userId: ID!) {
    oneTimeLogin(userId: $userId) {
      success
      url
    }
  }
`;

export const EntryRequestCreate = gql`
  mutation EntryRequestCreateMutation(
    $name: String!
    $email: String
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
    $source: String
    $visitationDate: String
    $startsAt: String
    $endsAt: String
    $companyName: String
    $temperature: String
    $occursOn: [String!]
    $visitEndDate: String
    $isGuest: Boolean
  ) {
    result: entryRequestCreate(
      name: $name
      email: $email
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
      source: $source
      visitationDate: $visitationDate
      startsAt: $startsAt
      endsAt: $endsAt
      companyName: $companyName
      temperature: $temperature
      occursOn: $occursOn
      visitEndDate: $visitEndDate
      isGuest: $isGuest
    ) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

// Reduce the returned response load
export const EntryRequestGrant = gql`
  mutation EntryRequestGrantAccessMutation($id: ID!) {
    result: entryRequestGrant(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

export const EntryRequestDeny = gql`
  mutation EntryRequestGrantMutation($id: ID!) {
    result: entryRequestDeny(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

export const loginPhoneMutation = gql`
  mutation loginPhoneStart($phoneNumber: String) {
    loginPhoneStart(phoneNumber: $phoneNumber) {
      user {
        id
      }
    }
  }
`;

export const loginEmailMutation = gql`
  mutation loginEmail($email: String) {
    loginEmail(email: $email) {
      user {
        id
      }
    }
  }
`;

export const loginPhoneConfirmCode = gql`
  mutation loginPhoneComplete($id: ID!, $token: String!) {
    loginPhoneComplete(id: $id, token: $token) {
      authToken
    }
  }
`;

export const switchGuards = gql`
  mutation loginSwitchUser($id: ID!) {
    loginSwitchUser(id: $id) {
      authToken
    }
  }
`;
export const CreateNote = gql`
  mutation noteCreate(
    $userId: ID
    $body: String!
    $flagged: Boolean
    $completed: Boolean
    $due: String
    $category: String
    $description: String
    $parentNoteId: ID
  ) {
    noteCreate(
      userId: $userId
      body: $body
      flagged: $flagged
      completed: $completed
      dueDate: $due
      category: $category
      description: $description
      parentNoteId: $parentNoteId
    ) {
      note {
        body
        id
      }
    }
  }
`;

export const TaskComment = gql`
  mutation noteCommentCreate(
    $noteId: ID!
    $body: String!
    $replyRequired: Boolean
    $replyFromId: ID
    $groupingId: ID
  ) {
    noteCommentCreate(
      noteId: $noteId
      body: $body
      replyRequired: $replyRequired
      replyFromId: $replyFromId
      groupingId: $groupingId
    ) {
      noteComment {
        body
      }
    }
  }
`;

export const TaskCommentUpdate = gql`
  mutation noteCommentUpdate($id: ID!, $body: String!) {
    noteCommentUpdate(id: $id, body: $body) {
      noteComment {
        body
      }
    }
  }
`;

export const DeleteNoteComment = gql`
  mutation noteCommentDelete($id: ID!) {
    noteCommentDelete(id: $id) {
      commentDelete
    }
  }
`;

export const DeleteNoteDocument = gql`
  mutation noteDocumentDelete($documentId: ID!) {
    noteDocumentDelete(documentId: $documentId) {
      documentDeleted
    }
  }
`;

export const AddNewProperty = gql`
  mutation AddNewProperty(
    $parcelNumber: String!
    $address1: String
    $address2: String
    $city: String
    $postalCode: String
    $stateProvince: String
    $parcelType: String
    $country: String
    $ownershipFields: JSON
    $objectType: String
    $status: String
    $houseLandParcelId: ID
  ) {
    PropertyCreate(
      parcelNumber: $parcelNumber
      address1: $address1
      address2: $address2
      city: $city
      postalCode: $postalCode
      stateProvince: $stateProvince
      parcelType: $parcelType
      country: $country
      ownershipFields: $ownershipFields
      objectType: $objectType
      status: $status
      houseLandParcelId: $houseLandParcelId
    ) {
      landParcel {
        id
      }
    }
  }
`;

export const UpdateProperty = gql`
  mutation UpdateProperty(
    $id: ID!
    $parcelNumber: String!
    $address1: String
    $address2: String
    $city: String
    $postalCode: String
    $stateProvince: String
    $parcelType: String
    $country: String
    $longX: Float
    $latY: Float
    $geom: JSON
    $ownershipFields: JSON
    $status: String
    $objectType: String
  ) {
    propertyUpdate(
      id: $id
      parcelNumber: $parcelNumber
      address1: $address1
      address2: $address2
      city: $city
      postalCode: $postalCode
      stateProvince: $stateProvince
      parcelType: $parcelType
      country: $country
      longX: $longX
      latY: $latY
      geom: $geom
      ownershipFields: $ownershipFields
      status: $status
      objectType: $objectType
    ) {
      landParcel {
        id
        accounts {
          id
          fullName
          address1
        }
      }
    }
  }
`;
export const LabelMerge = gql`
  mutation LabelMerge($labelId: ID!, $mergeLabelId: ID!) {
    labelMerge(labelId: $labelId, mergeLabelId: $mergeLabelId) {
      success
    }
  }
`;

export const DeleteLabel = gql`
  mutation LabelDelete($id: ID!) {
    labelDelete(id: $id) {
      labelDelete
    }
  }
`;

export const DeleteActionFlow = gql`
  mutation ActionFlowDelete($id: ID!) {
    actionFlowDelete(id: $id) {
      success
    }
  }
`;

export const MsgNotificationUpdate = gql`
  mutation MsgNotificationUpdate {
    messageNotificationUpdate {
      success
    }
  }
`;

export const LabelEdit = gql`
  mutation LabelEdit($id: ID!, $shortDesc: String!, $description: String, $color: String!) {
    labelUpdate(id: $id, shortDesc: $shortDesc, description: $description, color: $color) {
      label {
        id
      }
    }
  }
`;

export const UpdateNote = gql`
  mutation noteupdate(
    $id: ID!
    $body: String
    $flagged: Boolean
    $category: String
    $description: String
    $userId: ID
    $completed: Boolean
    $dueDate: String
    $parentNoteId: ID
    $documentBlobId: String
    $status: String
  ) {
    noteUpdate(
      id: $id
      body: $body
      flagged: $flagged
      category: $category
      description: $description
      userId: $userId
      completed: $completed
      dueDate: $dueDate
      parentNoteId: $parentNoteId
      documentBlobId: $documentBlobId
      status: $status
    ) {
      note {
        flagged
        body
        id
        dueDate
        status
        parentNote {
          id
        }
      }
    }
  }
`;
export const AcknowledgeRequest = gql`
  mutation EntryRequestAcknowledgeMutation($id: ID!) {
    result: entryRequestAcknowledge(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`;

export const createFeedback = gql`
  mutation FeedbackCreate($isThumbsUp: Boolean!, $review: String) {
    feedbackCreate(isThumbsUp: $isThumbsUp, review: $review) {
      feedback {
        user {
          id
          name
        }
        createdAt
        isThumbsUp
      }
    }
  }
`;

export const createShowroomEntry = gql`
  mutation ShowroomEntryCreate(
    $name: String
    $email: String
    $homeAddress: String
    $phoneNumber: String
    $nrc: String
    $reason: String
    $source: String
  ) {
    showroomEntryCreate(
      name: $name
      email: $email
      homeAddress: $homeAddress
      nrc: $nrc
      reason: $reason
      source: $source
      phoneNumber: $phoneNumber
    ) {
      showroom {
        name
        id
      }
    }
  }
`;

export const MessageCreate = gql`
  mutation messageCreate($receiver: String, $message: String!, $userId: ID!) {
    messageCreate(receiver: $receiver, message: $message, userId: $userId) {
      message {
        id
        message
      }
    }
  }
`;

export const TemperateRecord = gql`
  mutation temperatureUpdate($refId: ID!, $temp: String!, $refName: String!, $refType: String!) {
    temperatureUpdate(refId: $refId, temp: $temp, refName: $refName, refType: $refType) {
      eventLog {
        sentence
      }
    }
  }
`;

export const UpdateLogMutation = gql`
  mutation activityLogUpdateLog($refId: ID!) {
    activityLogUpdateLog(refId: $refId) {
      eventLog {
        data
      }
    }
  }
`;

export const CampaignCreate = gql`
  mutation campaignCreate(
    $name: String!
    $campaignType: String!
    $status: String!
    $emailTemplatesId: ID
    $message: String
    $batchTime: String
    $userIdList: String
    $labels: String
    $includeReplyLink: Boolean
  ) {
    campaignCreate(
      name: $name
      campaignType: $campaignType
      status: $status
      emailTemplatesId: $emailTemplatesId
      message: $message
      batchTime: $batchTime
      userIdList: $userIdList
      labels: $labels
      includeReplyLink: $includeReplyLink
    ) {
      campaign {
        id
      }
    }
  }
`;

export const CampaignUpdateMutation = gql`
  mutation campaignUpdate(
    $id: ID!
    $name: String
    $campaignType: String
    $status: String
    $message: String
    $batchTime: String
    $userIdList: String
    $labels: String
    $includeReplyLink: Boolean
    $emailTemplatesId: ID
  ) {
    campaignUpdate(
      id: $id
      name: $name
      campaignType: $campaignType
      status: $status
      message: $message
      batchTime: $batchTime
      userIdList: $userIdList
      labels: $labels
      includeReplyLink: $includeReplyLink
      emailTemplatesId: $emailTemplatesId
    ) {
      campaign {
        batchTime
        communityId
        createdAt
        endTime
        id
        message
        name
        campaignType
        status
        startTime
        updatedAt
        userIdList
        campaignMetrics {
          batchTime
          startTime
          endTime
          totalScheduled
          totalSent
          totalClicked
        }
      }
    }
  }
`;

export const DeleteCampaign = gql`
  mutation campaignDelete($id: ID!) {
    campaignDelete(id: $id) {
      campaign {
        id
        status
      }
    }
  }
`;

export const CommentMutation = gql`
  mutation commentCreate($discussionId: ID!, $content: String!, $imageBlobId: String) {
    commentCreate(discussionId: $discussionId, content: $content, imageBlobId: $imageBlobId) {
      comment {
        content
      }
    }
  }
`;

export const PostCreateMutation = gql`
  mutation postCreate($discussionId: ID!, $content: String, $imageBlobIds: [String!], $accessibility: String) {
    postCreate(discussionId: $discussionId, content: $content, imageBlobIds: $imageBlobIds, accessibility: $accessibility) {
      post {
        content
      }
    }
  }
`;

export const PostDeleteMutation = gql`
  mutation postDelete($id: ID!) {
    postDelete(id: $id) {
      success
    }
  }
`;

export const DiscussionMutation = gql`
  mutation discussionCreate($postId: String, $title: String!, $description: String) {
    discussionCreate(postId: $postId, title: $title, description: $description) {
      discussion {
        id
      }
    }
  }
`;

export const InvoiceCreate = gql`
  mutation InvoiceCreate(
    $landParcelId: ID!
    $description: String
    $note: String
    $amount: Float!
    $dueDate: String!
    $status: String!
    $userId: ID!
  ) {
    invoiceCreate(
      landParcelId: $landParcelId
      description: $description
      note: $note
      amount: $amount
      dueDate: $dueDate
      status: $status
      userId: $userId
    ) {
      invoice {
        id
        amount
        landParcel {
          id
          parcelNumber
        }
      }
    }
  }
`;

export const InvoiceCancel = gql`
  mutation InvoiceCancel($invoiceId: ID!) {
    invoiceCancel(invoiceId: $invoiceId) {
      invoice {
        id
      }
    }
  }
`;

export const PaymentCreate = gql`
  mutation PaymentCreate(
    $userId: ID!
    $amount: Float!
    $source: String!
    $bankName: String
    $chequeNumber: String
    $transactionNumber: String
    $landParcelId: ID!
    $receiptNumber: String
    $createdAt: String
  ) {
    walletTransactionCreate(
      userId: $userId
      amount: $amount
      source: $source
      bankName: $bankName
      chequeNumber: $chequeNumber
      transactionNumber: $transactionNumber
      landParcelId: $landParcelId
      receiptNumber: $receiptNumber
      createdAt: $createdAt
    ) {
      walletTransaction {
        id
        source
        amount
        status
        bankName
        chequeNumber
        transactionNumber
        currentWalletBalance
        createdAt
        settledInvoices
        currentPendingPlotBalance
        user {
          id
          name
        }
        depositor {
          id
          name
        }
        paymentPlan {
          id
          landParcel {
            id
            parcelNumber
          }
        }
        community {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

export const FollowPostTag = gql`
  mutation followPostTag($tagName: String!) {
    followPostTag(tagName: $tagName) {
      postTagUser {
        id
      }
    }
  }
`;

export const DiscussionSubscription = gql`
  mutation discussionUserCreate($discussionId: ID!) {
    discussionUserCreate(discussionId: $discussionId) {
      discussionUser {
        userId
        discussionId
        id
      }
    }
  }
`;

export const LabelCreate = gql`
  mutation labelCreate($shortDesc: String!, $description: String, $color: String) {
    labelCreate(shortDesc: $shortDesc, description: $description, color: $color) {
      label {
        id
        shortDesc
      }
    }
  }
`;

// UserLabelCreate
export const UserLabelCreate = gql`
  mutation userLabelCreate($query: String, $limit: Int, $labelId: String!, $userList: String) {
    userLabelCreate(query: $query, limit: $limit, labelId: $labelId, userList: $userList) {
      label {
        labelId
      }
    }
  }
`;

export const UserLabelUpdate = gql`
  mutation userLabelUpdate($userId: ID!, $labelId: ID!) {
    userLabelUpdate(userId: $userId, labelId: $labelId) {
      label {
        labelId
      }
    }
  }
`;

export const AssignUser = gql`
  mutation noteAssign($noteId: ID!, $userId: ID!) {
    noteAssign(noteId: $noteId, userId: $userId) {
      assigneeNote
    }
  }
`;

export const CampaignCreateThroughUsers = gql`
  mutation campaignCreateThroughUsers($query: String, $limit: Int, $userList: String) {
    campaignCreateThroughUsers(query: $query, limit: $limit, userList: $userList) {
      campaign {
        id
      }
    }
  }
`;
export const CampaignLabelRemoveMutation = gql`
  mutation labelRemove($campaignId: ID!, $labelId: ID!) {
    campaignLabelRemove(campaignId: $campaignId, labelId: $labelId) {
      campaign {
        id
      }
    }
  }
`;
export const MergeUsersMutation = gql`
  mutation mergeUsers($id: ID!, $duplicateId: ID!) {
    userMerge(id: $id, duplicateId: $duplicateId) {
      success
    }
  }
`;

export const UpdateCommentMutation = gql`
  mutation updateComment($commentId: ID!, $discussionId: ID!, $status: String!) {
    commentUpdate(commentId: $commentId, discussionId: $discussionId, status: $status) {
      success
    }
  }
`;

export const ImportCreate = gql`
  mutation usersImport($csvString: String!, $csvFileName: String!, $importType: String!) {
    usersImport(csvString: $csvString, csvFileName: $csvFileName, importType: $importType) {
      success
    }
  }
`;

export const DiscussionUpdateMutation = gql`
  mutation discussionUpdate($discussionId: ID!, $status: String!) {
    discussionUpdate(discussionId: $discussionId, status: $status) {
      success
    }
  }
`;

export const CreateActionFlow = gql`
  mutation actionFlowCreate(
    $title: String!
    $description: String!
    $eventType: String!
    $eventCondition: String
    $eventConditionQuery: String
    $eventAction: JSON
  ) {
    actionFlowCreate(
      title: $title
      description: $description
      eventType: $eventType
      eventCondition: $eventCondition
      eventConditionQuery: $eventConditionQuery
      eventAction: $eventAction
    ) {
      actionFlow {
        description
      }
    }
  }
`;

export const UpdateActionFlow = gql`
  mutation actionFlowUpdate(
    $id: ID!
    $title: String!
    $description: String!
    $eventType: String!
    $eventCondition: String
    $eventConditionQuery: String
    $eventAction: JSON
  ) {
    actionFlowUpdate(
      id: $id
      title: $title
      description: $description
      eventType: $eventType
      eventCondition: $eventCondition
      eventConditionQuery: $eventConditionQuery
      eventAction: $eventAction
    ) {
      actionFlow {
        description
      }
    }
  }
`;
