import React, { useContext } from 'react';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import PostsList from './PostList';

export default function Posts() {
  const authState = useContext(Context);
  const wordpressEndpoint = authState.user?.community.wpLink;
  return <PostsList wordpressEndpoint={wordpressEndpoint} />;
}
