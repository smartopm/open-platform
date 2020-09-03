/* eslint-disable */
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { createCache, createClient } from '../../utils/apollo'


export default function Component({ children }) {
  return (
    <ApolloProvider client={createClient(createCache())}>
      {children}
    </ApolloProvider>
  )
}

Component.displayName = 'ApolloProvider'
