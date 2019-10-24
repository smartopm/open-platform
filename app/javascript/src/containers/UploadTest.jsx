import React, {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import { useApolloClient } from 'react-apollo';

import { Context as AuthStateContext } from './Provider/AuthStateProvider.js';
import { useFileUpload } from '../graphql/useFileUpload'
import { AttachAvatar } from '../graphql/mutations'

import Nav from '../components/Nav'

export default function UploadTest({match}){
  const authState = useContext(AuthStateContext)
  const {onChange, status} = useFileUpload({updateGQL: AttachAvatar, id: match.params.id, client: useApolloClient()})
  if (status == 'DONE') {
    return (<Redirect to={`/user/${match.params.id}`} />)
  }
  return (<Component authState={authState} onChange={onChange} status={status} />)
}

function Status({status}) {
  if (status != 'INIT') {
    return <p>{status}</p>;
  }
  return null;
}

export function Component({onChange, status}) {
  return (
    <div>
      <Nav navName="Upload Avatar" menuButton="cancel" />
      <div className="container">
        <div className="row justify-content-center id_card">
          <form>
            <div>
              <label>Upload an image</label>
              <input type="file" accept="image/*" onChange={onChange} />
              <Status status={status} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
