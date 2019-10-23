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
  console.log(status)
  console.log(onChange)
  if (status == 'DONE') {
    return (<Redirect to={`/user/${match.params.id}`} />)
  }
  return (<Component authState={authState} onChange={onChange} />)
}

export function Component({onChange}) {
  return (
    <div>
      <Nav navName="Upload Avatar" menuButton="cancel" />
      <div className="container">
        <div className="row justify-content-center id_card">
          <form>
            <div>
              <label>Upload an image</label>
              <input type="file" accept="image/*" onChange={onChange} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
