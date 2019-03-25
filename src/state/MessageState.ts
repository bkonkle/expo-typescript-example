import {Messages} from '../Types'
import {ReduxAction, ReduxState} from './StateTypes'

export type State = Messages

export enum ActionTypes {
  pushError = 'Message.pushError',
  clearErrors = 'Message.clearErrors',
  pushNotification = 'Message.pushNotifications',
  clearNotifications = 'Message.clearNotifications',
}

export type PushError = ReduxAction<ActionTypes.pushError, {error: string}>
export type ClearErrors = ReduxAction<ActionTypes.clearErrors>
export type PushNotification = ReduxAction<ActionTypes.pushNotification, {notification: string}>
export type ClearNotifications = ReduxAction<ActionTypes.clearNotifications>
export type Action = PushError | ClearErrors | PushNotification | ClearNotifications

export const initialState: State = {errors: [], notifications: []}

export const Actions = {
  pushError: (error: string): PushError =>
    ({type: ActionTypes.pushError, payload: {error}}),
  clearErrors: (): ClearErrors =>
    ({type: ActionTypes.clearErrors, payload: undefined}),
    pushNotification: (notification: string): PushNotification =>
    ({type: ActionTypes.pushNotification, payload: {notification}}),
  clearNotifications: (): ClearNotifications =>
    ({type: ActionTypes.clearNotifications, payload: undefined}),
}

export const Selectors = {
  getState: (state: ReduxState) => state.messages,
  getErrors: (state: ReduxState) => Selectors.getState(state).errors,
  getNotifications: (state: ReduxState) => Selectors.getState(state).notifications,
}

export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.pushError:
      return {...state, errors: [...state.errors, action.payload.error]}
    case ActionTypes.clearErrors:
      return {...state, errors: []}
    case ActionTypes.pushNotification:
      return {...state, notifications: [...state.notifications, action.payload.notification]}
    case ActionTypes.clearNotifications:
      return {...state, notifications: []}
    default:
      return state
  }
}
