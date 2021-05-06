import React, { useContext } from 'react';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import PostsList from './PostList';

export default function Posts() {
  const authState = useContext(Context);
  const { wpLink, name } = authState.user?.community;
  return <PostsList wordpressEndpoint={wpLink} communityName={name} />;
}
