import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { App } from './react_main';
import ApolloProvider from '../src/containers/Provider/ApolloProvider';
// eslint-disable-next-line import/no-named-as-default
import AuthStateProvider, {
  Context as AuthStateContext
} from '../src/containers/Provider/AuthStateProvider';

function MainApp() {
  const authState = useContext(AuthStateContext);
  console.log(authState)
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        {/* If there is no community name we default to DoubleGDP */}
        <title>{authState.user?.community.name || 'DoubleGDP'}</title>
        <link rel="icon" type="image/png" href={authState.user?.community.imageUrl} sizes="16x16" />
      </Helmet>
      <App />
    </>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ApolloProvider>
      <AuthStateProvider>
        <MainApp />
      </AuthStateProvider>
    </ApolloProvider>,
    document.getElementById('root')
  );
});
