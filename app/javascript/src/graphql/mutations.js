/* eslint-disable */
import gql from 'graphql-tag'
import { UserFragment, EntryRequestFragment } from '../graphql/fragments'

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
    ) {
      user {
       id
      }
    }
  }
  `
  // ${UserFragment.publicFields}

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation(
    $id: ID!
    $name: String
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
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

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
`

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
`

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
`

export const AttachAvatar = gql`
  mutation AttachAvatar($id: ID!, $signedBlobId: String!) {
    userUpdate(id: $id, avatarBlobId: $signedBlobId) {
      user {
        ...UserFields
      }
    }
  }
  ${UserFragment.publicFields}
`

export const AddActivityLog = gql`
  mutation ActivityLogMutation(
    $userId: ID!
    $timestamp: String
    $digital: Boolean
    $note: String
  ) {
    activityLogAdd(
      userId: $userId
      timestamp: $timestamp
      digital: $digital
      note: $note
    ) {
      user {
        id
      }
    }
  }
`

export const SendOneTimePasscode = gql`
  mutation SendOneTimePasscode($userId: ID!) {
    oneTimeLogin(userId: $userId) {
      success
      url
    }
  }
`

export const DeleteBusiness = gql`
  mutation DeleteBusiness($id: ID!) {
    businessDelete(id: $id) {
      businessDelete
    }
  }
`

export const EntryRequestCreate = gql`
  mutation EntryRequestCreateMutation(
    $name: String!
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
    $source: String
    $visitationDate: String
    $startTime: String
    $endTime: String
  ) {
    result: entryRequestCreate(
      name: $name
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
      source: $source
      visitationDate: $visitationDate
      startTime: $startTime
      endTime: $endTime
    ) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestUpdate = gql`
  mutation EntryRequestUpdateMutation(
    $id: ID!
    $name: String!
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
  ) {
    result: entryRequestUpdate(
      id: $id
      name: $name
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
    ) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestGrant = gql`
  mutation EntryRequestGrantMutation($id: ID!) {
    result: entryRequestGrant(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const EntryRequestDeny = gql`
  mutation EntryRequestGrantMutation($id: ID!) {
    result: entryRequestDeny(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

export const loginPhone = gql`
  mutation loginPhoneStart($phoneNumber: String!) {
    loginPhoneStart(phoneNumber: $phoneNumber) {
      user {
        id
      }
    }
  }
`

export const loginPhoneConfirmCode = gql`
  mutation loginPhoneComplete($id: ID!, $token: String!) {
    loginPhoneComplete(id: $id, token: $token) {
      authToken
    }
  }
`

export const switchGuards = gql`
  mutation loginSwitchUser($id: ID!) {
    loginSwitchUser(id: $id) {
      authToken
    }
  }
`
export const CreateNote = gql`
  mutation noteCreate($userId: ID, $body: String!, $flagged: Boolean, $completed: Boolean, $due: String, $category: String, $description: String) {
    noteCreate(userId: $userId, body: $body, flagged: $flagged, completed: $completed, dueDate: $due, category: $category, description: $description) {
      note {
        body
        id
      }
    }
  }
`

export const TaskComment = gql`
mutation noteCommentCreate($noteId: ID!, $body: String!) {
  noteCommentCreate(
    noteId: $noteId,,
    body:$body
  ) {
    noteComment {
      body
    }
  }
}
`

export const TaskCommentUpdate = gql`
mutation noteCommentUpdate($id: ID!, $body: String!) {
  noteCommentUpdate(
    id: $id,
    body: $body
  ) {
    noteComment {
      body
    }
  }
}
`

export const DeleteNoteComment = gql`
  mutation noteCommentDelete($id: ID!) {
    noteCommentDelete(id: $id) {
      commentDelete
    }
  }
`

export const AddPlotNumber = gql`
  mutation AddPlotNumber($userId: ID!, $accountId: ID, $parcelNumber: String!) {
    landParcel(userId: $userId, accountId: $accountId, parcelNumber: $parcelNumber) {
      landParcel {
        id
      }
    }
  }
`

export const AddNewProperty = gql`
mutation AddNewProperty($parcelNumber: String!,
  $address1: String,
  $address2: String,
  $city: String,
  $postalCode: String,
  $stateProvince: String,
  $parcelType: String,
  $country: String) {
    PropertyCreate(parcelNumber: $parcelNumber,
    address1: $address1,
    address2: $address2,
    city: $city,
    postalCode: $postalCode,
    stateProvince: $stateProvince,
    parcelType: $parcelType,
    country: $country) {
      landParcel {
        id
    }
  }
}
`

export const EditPlotNumber = gql`
  mutation EditPlotNumber($id: ID!, $parcelNumber: String!) {
    landParcelUpdate(id: $id, parcelNumber: $parcelNumber) {
      landParcelUpdate
    }
  }
`

export const LabelMerge = gql`
  mutation LabelMerge($labelId: ID!, $mergeLabelId: ID!) {
    labelMerge(labelId: $labelId, mergeLabelId: $mergeLabelId) {
      success
   }
  }
`

export const DeleteLabel = gql`
  mutation LabelDelete($id: ID!) {
    labelDelete(id: $id) {
      labelDelete
    }
  }
`

export const DeleteActionFlow = gql`
  mutation ActionFlowDelete($id: ID!) {
    actionFlowDelete(id: $id) {
      success
    }
  }
`

export const MsgNotificationUpdate = gql`
  mutation MsgNotificationUpdate {
    messageNotificationUpdate {
      success
    }
  }
`

export const LabelEdit = gql`
  mutation LabelEdit($id: ID! $shortDesc: String!, $description: String, $color: String!) {
    labelUpdate(id: $id shortDesc: $shortDesc, description: $description, color: $color) {
      label {
        id
      }
    }
  }
`

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
    ) {
      note {
        flagged
        body
        id
        dueDate
      }
    }
  }
`
export const AcknowledgeRequest = gql`
  mutation EntryRequestAcknowledgeMutation($id: ID!) {
    result: entryRequestAcknowledge(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`

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
`

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
`

export const MessageCreate = gql`
  mutation messageCreate($receiver: String, $message: String!, $userId: ID!) {
    messageCreate(receiver: $receiver, message: $message, userId: $userId) {
      message {
        id
        message
      }
    }
  }
`

export const TemperateRecord = gql`
  mutation temperatureUpdate(
    $refId: ID!
    $temp: String!
    $refName: String!
    $refType: String!
  ) {
    temperatureUpdate(
      refId: $refId
      temp: $temp
      refName: $refName
      refType: $refType
    ) {
      eventLog {
        sentence
      }
    }
  }
`
// Start shift
// End shift
export const ManageShiftMutation = gql`
  mutation manageShift($userId: ID!, $eventTag: String!) {
    manageShift(userId: $userId, eventTag: $eventTag) {
      timeSheet {
        id
      }
    }
  }
`

export const UpdateLogMutation = gql`
  mutation activityLogUpdateLog($refId: ID!) {
    activityLogUpdateLog(refId: $refId) {
      eventLog {
        data
      }
    }
  }
`

export const CampaignCreate = gql`
  mutation campaignCreate(
    $name: String!
    $campaignType: String!
    $status: String!
    $message: String
    $batchTime: String
    $userIdList: String
    $labels: String
    $subject: String
    $preHeader: String
    $templateStyle: String
    $includeReplyLink: Boolean
  ) {
    campaignCreate(
      name: $name
      campaignType: $campaignType
      status: $status
      message: $message
      batchTime: $batchTime
      userIdList: $userIdList
      labels: $labels
      subject: $subject
      preHeader: $preHeader
      templateStyle: $templateStyle
      includeReplyLink: $includeReplyLink
    ) {
      campaign {
        name
      }
    }
  }
`

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
    $subject: String
    $preHeader: String
    $templateStyle: String
    $includeReplyLink: Boolean
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
      subject: $subject
      preHeader: $preHeader
      templateStyle: $templateStyle
      includeReplyLink: $includeReplyLink
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
        subject
        preHeader
        templateStyle
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
`

export const DeleteCampaign = gql`
  mutation campaignDelete($id: ID!){
    campaignDelete(id: $id){
      campaign {
        id
        status
      }
    }
  }
`

export const CommentMutation = gql`
  mutation commentCreate($discussionId: ID!, $content: String!, $imageBlobId: String) {
    commentCreate(discussionId: $discussionId, content: $content, imageBlobId: $imageBlobId) {
      comment {
        content
      }
    }
  }
`

export const DiscussionMutation = gql`
  mutation discussionCreate(
    $postId: String
    $title: String!
    $description: String
  ) {
    discussionCreate(
      postId: $postId
      title: $title
      description: $description
    ) {
      discussion {
        id
      }
    }
  }
`

export const InvoiceCreate = gql`
  mutation InvoiceCreate(
    $landParcelId: ID!
    $description: String
    $note: String
    $amount: String!
    $dueDate: String!
    $status: String!
  ) {
    invoiceCreate(
      landParcelId: $landParcelId
      description: $description
      note: $note
      amount: $amount
      dueDate: $dueDate
      status: $status
    ) {
      invoice {
        id
      }
    }
  }
`

export const FollowPostTag = gql`
    mutation followPostTag($tagName: String!){
      followPostTag(tagName: $tagName){
        postTagUser {
          id
        }
      }
    }
`

export const DiscussionSubscription = gql`
  mutation discussionUserCreate(
    $discussionId: ID!
  ){
    discussionUserCreate(
      discussionId: $discussionId
    ){
      discussionUser{
        userId
        discussionId
        id
      }
    }
  }
`

export const LabelCreate = gql`
  mutation labelCreate($shortDesc: String!) {
    labelCreate(shortDesc: $shortDesc) {
      label {
        id
      }
    }
  }
`

// UserLabelCreate
export const UserLabelCreate = gql`
    mutation userLabelCreate($query: String, $limit: Int, $labelId: String!, $userList: String,){
       userLabelCreate(query: $query, limit: $limit, labelId: $labelId, userList: $userList){
         label {
           labelId
         }
       }
    }
`

export const UserLabelUpdate = gql`
  mutation userLabelUpdate($userId: ID!, $labelId: ID!) {
    userLabelUpdate(userId: $userId, labelId: $labelId) {
      label {
        labelId
      }
    }
  }
`

export const AssignUser = gql`
  mutation noteAssign($noteId: ID!, $userId: ID!){
    noteAssign(noteId: $noteId, userId: $userId){
      assigneeNote
    }
  }
`

export const NotificationPreference = gql`
  mutation notificationPreference($preferences: String){
    notificationPreference(preferences: $preferences){
        __typename
  }
}
`
export const CampaignCreateThroughUsers = gql `
  mutation campaignCreateThroughUsers($query: String, $limit: Int, $userList: String){
    campaignCreateThroughUsers(query: $query, limit: $limit, userList: $userList){
      campaign{
        id
      }
    }
  }
`
export const CampaignLabelRemoveMutation = gql`
mutation labelRemove($campaignId: ID!, $labelId: ID!) {
  campaignLabelRemove(campaignId: $campaignId, labelId: $labelId){
    campaign {
      id
    }
  }
}
`
export const MergeUsersMutation = gql`
mutation mergeUsers($id: ID!, $duplicateId: ID!){
  userMerge(id: $id, duplicateId: $duplicateId){
    success
  }
}
`
export const BusinessCreateMutation = gql`
mutation businessCreate($name: String!, $email: String!, $phoneNumber: String!, $status: String, $userId: ID!, $imageUrl: String, $operationHours: String, $description: String, $links: String, $homeUrl: String, $category: String, $address: String) {
  businessCreate(name: $name, email: $email, phoneNumber: $phoneNumber, status: $status, userId: $userId, imageUrl: $imageUrl, links: $links, category: $category, operationHours: $operationHours, description: $description, homeUrl: $homeUrl, address: $address) {
    business {
      id
    }
  }
}
`

export const UpdateCommentMutation = gql`
mutation updateComment($commentId: ID!, $discussionId: ID!, $status: String!){
  commentUpdate(commentId: $commentId, discussionId: $discussionId, status: $status){
    success
  }
}
`
export const LogReadPost = gql`
  mutation LogReadPost($postId: String!) {
    logReadPost(postId: $postId) {
      eventLog {
        id
      }
    }
  }
`

export const LogSharedPost = gql`
  mutation LogSharedPost($postId: String!) {
    logSharedPost(postId: $postId) {
      eventLog {
        id
      }
    }
  }
`
export const FormUserCreateMutation = gql`
  mutation formUserCreate($formId: ID!, $userId: ID!, $propValues: JSON!){
    formUserCreate(formId: $formId, userId: $userId, propValues: $propValues){
      formUser {
        id
      }
      error
    }
  }
`

export const ImportCreate = gql`
  mutation usersImport($csvString: String!) {
    usersImport(csvString: $csvString) {
      errors,
      noOfDuplicates,
      noOfValid,
      noOfInvalid
    }
  }
`

export const TaskReminder = gql`
  mutation setNoteReminder($noteId: ID!, $hour: Int!) {
    setNoteReminder(noteId: $noteId, hour: $hour) {
      note {
        id
      }
    }
  }
`

export const DiscussionUpdateMutation = gql`
  mutation discussionUpdate($discussionId: ID!, $status: String!){
    discussionUpdate(discussionId: $discussionId, status: $status){
      success
    }
  }
`
export const FormUserUpdateMutation = gql`
  mutation formUserUpdate($formId: ID!, $userId: ID!, $propValues: JSON!){
    formUserUpdate(formId: $formId, userId: $userId, propValues: $propValues){
      formUser {
        id
      }
    }
  }
`
export const FormUserStatusUpdateMutation = gql`
    mutation formUserStatusUpdate($formId: ID!, $userId: ID!, $status: String!){
      formUserStatusUpdate(formId: $formId, userId: $userId, status:$status){
        formUser {
          id
        }
      }
    }
`

export const CreateActionFlow = gql`
  mutation actionFlowCreate($title: String!, $description: String!, $eventType: String!, $eventCondition: String, $eventConditionQuery: String, $eventAction: JSON){
    actionFlowCreate(title: $title, description: $description, eventType: $eventType, eventCondition: $eventCondition, eventConditionQuery: $eventConditionQuery, eventAction: $eventAction){
      actionFlow {
        description
      }
    }
  }
`

export const UpdateActionFlow = gql`
  mutation actionFlowUpdate($id: ID!, $title: String!, $description: String!, $eventType: String!, $eventCondition: String, $eventConditionQuery: String, $eventAction: JSON){
    actionFlowUpdate(id: $id, title: $title, description: $description, eventType: $eventType, eventCondition: $eventCondition, eventConditionQuery: $eventConditionQuery, eventAction: $eventAction){
      actionFlow {
        description
      }
    }
  }
`
