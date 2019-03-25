import ApolloClient from 'apollo-client'
import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {identity} from 'ramda'
import {reduxThunkContextMiddleware} from 'redux-thunk-context'

import * as Messages from './MessageState'
import * as User from './UserState'
import {ReduxState} from './StateTypes'

declare global {
  /**
   * Extend the Window object's type to support Redux devtools
   */
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__? (f?: any): any, // tslint:disable-line no-any - debug tooling
  }

  interface NodeModule {
    hot: {
      accept (path?: string[], callback?: () => void): void
    }
  }
}

export const initialState: ReduxState = {
  messages: Messages.initialState,
  user: User.initialState,
}

// Get the Redux DevTools extension and fallback to a no-op function
let devtools = identity
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__()
}

const rootReducer = combineReducers<ReduxState>({
  messages: Messages.reducer,
  user: User.reducer,
})

export function init (preloadedState: ReduxState = initialState, client: ApolloClient<{}>) {
  const store = createStore(
    rootReducer, preloadedState,
    compose(
      applyMiddleware(reduxThunkContextMiddleware(() => ({client}))),
      devtools
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(['./MessageState', './OptionState', './UserState'], () => {
      // tslint:disable no-require-imports
      const messagesModule: typeof Messages = require('./MessageState')
      const userModule: typeof User = require('./UserState')
      // tslint:enable no-require-imports

      store.replaceReducer(combineReducers<ReduxState>({
        messages: messagesModule.reducer,
        user: userModule.reducer,
      }))
    })
  }

  return store
}
