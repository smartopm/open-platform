import React, {useContext} from 'react';
import { useApolloClient } from 'react-apollo';

import { Context as AuthStateContext } from './Provider/AuthStateProvider.js';
import { useFileUpload } from '../graphql/useFileUpload'

import Nav from '../components/Nav'

export default function UploadTest(){
  const authState = useContext(AuthStateContext)
  const {onChange, status, url, uploadUrl, signedBlobId} = useFileUpload({client: useApolloClient()})
  console.log(status)
  console.log(url, uploadUrl)
  console.log(signedBlobId) // This is what's sent to Update/CreateUser as avatarBlobId
  return (<Component authState={authState} onChange={onChange} status={status} url={url} />)
}

function Status({status, url}) {
  if (status === 'DONE') {
    return <img src={url} />;
  } else if (status !== 'INIT') {
    return <p>{status}</p>;
  }
  return null;
}

export function Component({onChange, status, url}) {
  return (
    <div>
      <Nav navName="Upload Avatar" menuButton="cancel" />
      <div className="container">
        <div className="row justify-content-center id_card">
          <form>
            <div>
              <label>Upload an image</label>
              <input type="file" accept="image/*" onChange={onChange} />
              <Status status={status} url={url} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
