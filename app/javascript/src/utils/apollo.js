/* eslint-disable */
/* istanbul ignore file */
// client
import { ApolloClient } from 'apollo-client'
import 'isomorphic-unfetch'
// cache
import { InMemoryCache } from 'apollo-cache-inmemory'
// links
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'

export const createCache = () => {
  const cache = new InMemoryCache()
  if (process.env.NODE_ENV === 'development') {
    window.secretVariableToStoreCache = cache
  }
  return cache
}

export const AUTH_TOKEN_KEY = 'dgdp_auth_token'
export const AUTH_FORWARD_URL_KEY = 'dgdp_auth_forward_url'

// getToken from meta tags
export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY)

const setTokenForOperation = async operation => {
  const authToken = getAuthToken()
  if (authToken) {
    operation.setContext({
      headers: {
        authorization: authToken ? `Bearer ${authToken}` : ''
      }
    })
  }
}

// link with token
const createLinkWithToken = () =>
  new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle
        Promise.resolve(operation)
          .then(setTokenForOperation)
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            })
          })
          .catch(observer.error.bind(observer))
        return () => {
          if (handle) handle.unsubscribe()
        }
      })
  )

const logError = error => console.error(error)
// create error link
const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      // visualize error better, rollbar might not like this.
      console.error(graphQLErrors[0].message)
      logError('GraphQL - Error', {
        errors: graphQLErrors,
        operationName: operation.operationName,
        variables: operation.variables
      })
    }
    if (networkError) {
      console.error(networkError.message)
      logError('GraphQL - NetworkError', networkError)
    }
  })

const createHttpLink = () =>
  new HttpLink({
    uri: '/graphql',
    credentials: 'include'
  })

export const createClient = cache => {
  return new ApolloClient({
    link: ApolloLink.from([
      createLinkWithToken(),
      createErrorLink(),
      createHttpLink()
    ]),
    cache
  })
}
