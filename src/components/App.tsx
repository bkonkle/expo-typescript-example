import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {ApolloProvider} from 'react-apollo'

import Routes from '../Routes'
import * as Store from '../state/Store'
import * as ApiClient from '../data/ApiClient'

const client = ApiClient.init()
const store = Store.init(undefined, client)

export default class App extends Component {
  render () {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Routes />
        </Provider>
      </ApolloProvider>
    )
  }
}
