import { useReducer, useEffect } from 'react';
import { FileChecksum } from '@rails/activestorage/src/file_checksum';
import imageCompression from 'browser-image-compression';

import { CreateUpload } from './mutations';

// FileUploader
// Steps:
// - Resize the image using HTML5 canvas
// - Checksum the image for rails
// - Upload the file details to rails and get back an upload URL
// - Upload the files to rails
// - Update the user with the new blob
//

const getFileData = file => {
  return new Promise((resolve, reject) => {
    FileChecksum.create(file, (error, checksum) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(checksum);
    });
  });
};

const uploadFileMetaToRails = (state, apolloClient) => {
  return apolloClient.mutate({
    mutation: CreateUpload,
    variables: {
      checksum: state.checksum,
      filename: state.filename,
      contentType: state.contentType,
      byteSize: state.byteSize
    }
  });
};

const uploadFileToRails = state => {
  return fetch(state.uploadUrl, {
    method: 'PUT',
    headers: JSON.parse(state.headers),
    body: state.file
  });
};

// Constants
const STATE = {
  INIT: 'INIT',
  FILE_RESIZE: 'FILE_RESIZE',
  FILE_CHECKSUM: 'FILE_CHECKSUM',
  FILE_META_UPLOAD: 'FILE_META_UPLOAD',
  FILE_UPLOAD: 'FILE_UPLOAD',
  DONE: 'DONE',
  ERROR: 'ERROR'
};

const initialState = {
  file: null,
  uploading: false,

  checksum: null,
  byteSize: null,
  contentType: null,
  fileName: null,
  signedBlobId: null,
  blobId: null,
  uploadUrl: null,
  url: null,
  headers: null,
  status: STATE.INIT
};

const reducer = (state, action) => {
  switch (action.current) {
    case STATE.FILE_INIT:
      return {
        ...state,
        file: action.file,
        filename: action.filename,
        status: action.next
      };
    case STATE.FILE_CHECKSUM:
      return { ...state, checksum: action.checksum, status: action.next };
    case STATE.FILE_RESIZE:
      return {
        ...state,
        file: action.file,
        byteSize: action.byteSize,
        contentType: action.contentType,
        status: action.next
      };
    case STATE.FILE_META_UPLOAD:
      return {
        ...state,
        signedBlobId: action.signedBlobId,
        blobId: action.blobId,
        headers: action.headers,
        url: action.url,
        uploadUrl: action.uploadUrl,
        status: action.next
      };
    case STATE.FILE_UPLOAD:
      return { ...state, status: action.next };
    case STATE.ERROR:
      return { ...state, status: STATE.ERROR };
    default:
      return state;
  }
};

const useFileUpload = ({ client: apolloClient }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = async (file, compressImage = true) => {
    const checkFileType = file.type.split('/')[0] === 'image';
    if (!checkFileType || !compressImage) {
      return startUpload(file);
    }

    try {
      const options = {
        maxSizeMB: 0.1,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      startUpload(compressedFile);
    } catch (error) {
      // tolu: look for a better way to handle this error apart from dispatch
      console.log(error);
    }
    return null;
  };

  const startUpload = file => {
    dispatch({
      next: STATE.FILE_RESIZE,
      current: STATE.FILE_INIT,
      file,
      filename: file.name || 'unknown.webm'
    });
  };

  // Upload the 'placeholder' for the object and get back blob details
  useEffect(() => {
    if (state.status === STATE.FILE_RESIZE) {
      // check the file type before resizing
      // ImageResize({ file: state.file, maxSize }).then(resizedImage => {
      dispatch({
        file: state.file,
        contentType: state.file.type,
        byteSize: state.file.size,

        current: STATE.FILE_RESIZE,
        next: STATE.FILE_CHECKSUM
      });
      // })
    }
    if (state.status === STATE.FILE_CHECKSUM) {
      getFileData(state.file).then(checksum => {
        dispatch({
          checksum,

          current: STATE.FILE_CHECKSUM,
          next: STATE.FILE_META_UPLOAD
        });
      });
    }
    if (state.status === STATE.FILE_META_UPLOAD) {
      // Upload file meta data
      // Then set state and ready for file upload
      uploadFileMetaToRails(state, apolloClient).then(result => {
        const { attachment } = result.data.createUpload;
        dispatch({
          signedBlobId: attachment.signedBlobId,
          blobId: attachment.blobId,
          headers: attachment.headers,
          url: attachment.url,
          uploadUrl: attachment.uploadUrl,

          current: STATE.FILE_META_UPLOAD,
          next: STATE.FILE_UPLOAD
        });
      });
    }

    if (state.status === STATE.FILE_UPLOAD) {
      // Upload file meta data
      // Then set state and ready for file upload
      uploadFileToRails(state).then(() => {
        dispatch({ current: STATE.FILE_UPLOAD, next: STATE.DONE });
      });
    }
  });

  return {
    ...state,
    onChange,
    startUpload
  };
};

export default useFileUpload;
