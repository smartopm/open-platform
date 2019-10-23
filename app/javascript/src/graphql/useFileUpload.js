import { useReducer, useEffect } from 'react'
import { FileChecksum } from "@rails/activestorage/src/file_checksum";

import {CreateUpload} from "../graphql/mutations"
import ImageResize from "../utils/imageResizer"


// FileUploader
// Steps:
// - Resize the image using HTML5 canvas
// - Checksum the image for rails
// - Upload the file details to rails and get back an upload URL
// - Upload the files to rails
// - Update the user with the new blob
//

const getFileData = (file) => {
  return new Promise((resolve, reject) => {
    FileChecksum.create(file, (error, checksum) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(checksum);
    });
  })
}

const uploadFileMetaToRails = (state, apolloClient) => {
  console.log(apolloClient)
  console.log(CreateUpload)
  return apolloClient.mutate({
    mutation: CreateUpload,
    variables: {
      checksum: state.checksum,
      filename: state.filename,
      contentType: state.contentType,
      byteSize: state.byteSize
    }
  })
}

const uploadFileToRails = (state) => {
  return fetch(state.url, {
    method: 'PUT',
    headers: JSON.parse(state.headers),
    body: state.file
  })
}

const updateRecord = ({apolloClient, mutation, recordId, signedBlobId}) => {
  console.log(signedBlobId, recordId)
  return apolloClient.mutate({mutation, variables: {id: recordId, signedBlobId}})
}

// Constants
const STATE = {
  INIT: 'INIT',
  FILE_RESIZE: 'FILE_RESIZE',
  FILE_CHECKSUM: 'FILE_CHECKSUM',
  FILE_META_UPLOAD: 'FILE_META_UPLOAD',
  FILE_UPLOAD: 'FILE_UPLOAD',
  RECORD_UPDATE: 'RECORD_UPDATE',
  DONE: 'DONE',
  ERROR: 'ERROR',
}

const initialState = {
  file: null,
  uploading: false,

  checksum: null,
  byteSize: null,
  contentType: null,
  fileName: null,
  signedBlobId: null,
  blobId: null,
  url: null,
  headers: null,

  status: STATE.FILE_INIT,
}

const reducer = (state, action) => {
  console.log(action)
  switch (action.current) {
    case STATE.FILE_INIT:
      return {...state,
        file: action.file,
        filename: action.filename,
        status: action.next
      }
    case STATE.FILE_CHECKSUM:
      return { ...state, 
        checksum: action.checksum,
        status:  action.next }
    case STATE.FILE_RESIZE:
      return { ...state,
        file: action.file,
        byteSize: action.byteSize,
        contentType: action.contentType,
        status: action.next }
    case STATE.FILE_META_UPLOAD:
      return { ...state,
        signedBlobId: action.signedBlobId,
        blobId: action.blobId,
        headers: action.headers,
        url: action.url,
        status: action.next
      }
    case STATE.FILE_UPLOAD:
      return { ...state, status: action.next }
    case STATE.RECORD_UPDATE:
      return { ...state, status: action.next }
    case STATE.ERROR:
      return { ...state, status: STATE.ERROR }
    default:
      return state
  }
}

const useFileUpload = ({updateGQL: recordUpdateGQL, id: recordId, client: apolloClient}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0]
      dispatch({
        next: STATE.FILE_RESIZE,
        current: STATE.FILE_INIT,
        file: file,
        filename: file.name,
      })
    }
  }

  // Upload the 'placeholder' for the object and get back blob details
  useEffect(() => {
    console.log(state)
    if (state.status == STATE.FILE_RESIZE) {
      ImageResize({file: state.file, maxSize: 500}).then((resizedImage) => {
        dispatch({
          file: resizedImage,
          contentType: resizedImage.type,
          byteSize: resizedImage.size,

          current: STATE.FILE_RESIZE, 
          next: STATE.FILE_CHECKSUM
        })
      });
    }
    if (state.status == STATE.FILE_CHECKSUM) {
      getFileData(state.file).then((checksum) => {
        dispatch({
          checksum,

          current: STATE.FILE_CHECKSUM, 
          next: STATE.FILE_META_UPLOAD
        })

      })
      
    }
    if (state.status == STATE.FILE_META_UPLOAD) {
      // Upload file meta data
      // Then set state and ready for file upload
      uploadFileMetaToRails(state, apolloClient).then((result) => {
        console.log(result)
        const attachment = result.data.createUpload.attachment
        dispatch({
          signedBlobId: attachment.signedBlobId,
          blobId: attachment.blobId,
          headers: attachment.headers,
          url: attachment.url,

          current: STATE.FILE_META_UPLOAD,
          next: STATE.FILE_UPLOAD,
        })
      });
    }

    if (state.status == STATE.FILE_UPLOAD) {
      // Upload file meta data
      // Then set state and ready for file upload
      uploadFileToRails(state).then(() => {
        dispatch({ current: STATE.FILE_UPLOAD, next: STATE.RECORD_UPDATE })
      });
    }

    if (state.status == STATE.RECORD_UPDATE) {
      // Upload record data
      // Then set state and ready for file upload
      updateRecord({apolloClient, mutation:recordUpdateGQL, signedBlobId:state.signedBlobId, recordId}).then((data) => {
        console.log(data)
        dispatch({ current: STATE.RECORD_UPDATE, next: STATE.DONE })
      })
    }
  })

  return {
    ...state,
    onChange,
  }
}

export {
  useFileUpload
}
