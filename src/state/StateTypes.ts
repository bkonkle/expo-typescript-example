import {ApolloClient} from 'apollo-client'
import {ThunkContextAction} from 'redux-thunk-context'

import {State as MessageState} from './MessageState'
import {State as UserState} from './UserState'

export interface ReduxAction<Name extends string, Payload = undefined, Meta = undefined> {
  type: Name
  payload: Payload extends object ? Payload : undefined
  readonly meta?: Meta
}

export interface ReduxState {
  messages: MessageState
  user: UserState
}

export interface ReduxContext {
  client: ApolloClient<{}>
}

export type ReduxThunk<R> = ThunkContextAction<R, ReduxState, ReduxContext>
