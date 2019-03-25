import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient} from 'apollo-client'
import {setContext} from 'apollo-link-context'
import {createHttpLink} from 'apollo-link-http'
import {createPersistedQueryLink} from 'apollo-link-persisted-queries'

import Config from '../Config'
import {getAccessToken} from './AuthClient'

export type ApolloClient = ReturnType<typeof init>

export function init () {
  const cache = new InMemoryCache()

  const httpLink = createPersistedQueryLink().concat(createHttpLink({
    uri: Config.Api.endpoint,
  }))

  const authLink = setContext(async (_, {headers}) => {
    const token = await getAccessToken()
    const accessToken = token && token.accessToken
    const tokenType = token && token.tokenType

    return {
      headers: {
        ...headers,
        ...(accessToken ? {authorization: `${tokenType || 'Bearer'} ${accessToken}`} : {})
      }
    }
  })

  const link = authLink.concat(httpLink)

  return new ApolloClient({link, cache})
}
