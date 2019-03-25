import {Dispatch} from 'redux'
import {Omit} from 'ramda'

import {ReduxState, ReduxAction, ReduxThunk} from './StateTypes'
import {
  GetCurrentUser, GetCurrentUserData, GetCurrentUserInput,
  apiUserToUser,
} from '../data/UserData'
import {
  UpdateAccountInput, UpdateAccountData, UpdateAccount,
  CreateAccountData, CreateAccountInput, CreateAccount,
  CreateAddressInput, CreateAddressData, CreateAddress,
  UpdateAddressInput, UpdateAddressData, UpdateAddress,
  apiAccountToAccount,
} from '../data/AccountData'
import {getAccessToken} from '../data/AuthClient'
import {User, Account, Address, AccountAttributes} from '../Types'

export interface State {
  isAuthenticated: boolean,
  user?: User,
}

export enum ActionTypes {
  setIsAuthenticated = 'User.setIsAuthenticated',
  setUser = 'User.setUser',
}

export type SetIsAuthenticated = ReduxAction<
  ActionTypes.setIsAuthenticated,
  {isAuthenticated: boolean}
>
export type SetUser = ReduxAction<
  ActionTypes.setUser, {user: User}
>
export type Action = SetIsAuthenticated | SetUser

export type RefreshUser = ReduxThunk<Promise<User | undefined>>
export type CreateOrUpdateAccount = ReduxThunk<Promise<Account | undefined>>
export type CreateOrUpdateAddress = ReduxThunk<Promise<Address | undefined>>

export type CreateOrUpdateAccountInput = Omit<
  UpdateAccountInput['input']['accountPatch'],
  'attributes'
> & {user?: string, attributes?: AccountAttributes}

export type CreateOrUpdateAddressInput =
  | CreateAddressInput['input']['address']
  | UpdateAddressInput['input']['addressPatch']

export const initialState: State = {isAuthenticated: false, user: undefined}

export const Selectors = {
  getState: (state: ReduxState) => state.user,
  getIsAuthenticated: (state: ReduxState) => Selectors.getState(state).isAuthenticated,
  getUser: (state: ReduxState) => Selectors.getState(state).user,
  getAccount: (state: ReduxState) => {
    const user = Selectors.getUser(state)

    return user && user.account
  },
  getUsername: (state: ReduxState) => {
    const user = Selectors.getUser(state)

    return user && user.username
  },
}

export const Actions = {
  /**
   * Pure
   */
  setIsAuthenticated: (isAuthenticated: boolean): SetIsAuthenticated =>
    ({type: ActionTypes.setIsAuthenticated, payload: {isAuthenticated}}),
  setUser: (user: User): SetUser =>
    ({type: ActionTypes.setUser, payload: {user}}),

  /**
   * Stateful
   */
  refreshUser: (): RefreshUser => async (dispatch: Dispatch, _getState, context) => {
    const token = await getAccessToken()
    if (token) {
      const result = await context.client.mutate<GetCurrentUserData, GetCurrentUserInput>({
        mutation: GetCurrentUser,
        variables: {
          input: {
            clientMutationId: new Date().getTime().toString(),
          },
        }
      })
      const data: GetCurrentUserData['getCurrentUser'] = result.data && result.data.getCurrentUser
  
      if (data && data.user) {
        const user = apiUserToUser(data.user)

        if (user) {
          dispatch(Actions.setUser(user))
      
          return user
        }
      }
    }
  },

  createOrUpdateAccount: (
    input: CreateOrUpdateAccountInput
  ): CreateOrUpdateAccount => async (dispatch: Dispatch, getState, context) => {
    const user = Selectors.getUser(getState())
    const {client} = context

    if (user && user.account) {
      const result = await client.mutate<UpdateAccountData, UpdateAccountInput>({
        mutation: UpdateAccount,
        variables: {
          input: {
            clientMutationId: new Date().getTime().toString(),
            id: user.account.id,
            accountPatch: {
              ...input,
              attributes: JSON.stringify({
                ...(user.account && user.account.attributes || {}),
                ...(input.attributes || {}),
              }),
            },
          }
        },
      })

      const data = result.data as UpdateAccountData
      const apiAccount = data && data.updateAccountById && data.updateAccountById.account
      const account = apiAccount && apiAccountToAccount(apiAccount)

      dispatch(Actions.setUser({
        ...user,
        account,
      }))

      return account
    } else if (user) {
      // Create a new account
      const result = await client.mutate<CreateAccountData, CreateAccountInput>({
        mutation: CreateAccount,
        variables: {
          input: {
            clientMutationId: new Date().getTime().toString(),
            account: {
              ...(input as CreateAccountInput['input']['account']),
              user: user.id,
              attributes: input.attributes && JSON.stringify(input.attributes),
            },
          }
        }
      })

      const data = result.data as CreateAccountData
      const apiAccount = data && data.createAccount && data.createAccount.account
      const account = apiAccount && apiAccountToAccount(apiAccount)

      dispatch(Actions.setUser({
        ...user,
        account,
      }))

      return account
    }
  },

  createOrUpdateAddress: (
    input: CreateOrUpdateAddressInput
  ): CreateOrUpdateAddress => async (dispatch, getState, context) => {
    const {client} = context

    const user = Selectors.getUser(getState())

    if (user && user.account && user.account.address) {
      // Update the existing address
      const result = await client.mutate<UpdateAddressData, UpdateAddressInput>({
        mutation: UpdateAddress,
        variables: {
          input: {
            clientMutationId: new Date().getTime().toString(),
            id: user.account.address.id,
            addressPatch: input,
          },
        },
      })

      const data = result.data as UpdateAddressData

      return data.updateAddressById && data.updateAddressById.address
    } else {
      // Create a new address and save it to the account
      const result = await client.mutate<CreateAddressData, CreateAddressInput>({
        mutation: CreateAddress,
        variables: {
          input: {
            clientMutationId: new Date().getTime().toString(),
            address: input,
          },
        },
      })

      const data = result.data as CreateAddressData
      const address = data.createAddress && data.createAddress.address

      if (!address) {
        console.error(new Error('Unable to create Address'))

        return
      }

      await dispatch(Actions.createOrUpdateAccount({address: address.id}))

      return address
    }
  },
}

export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.setIsAuthenticated:
      return {...state, isAuthenticated: action.payload.isAuthenticated}
    case ActionTypes.setUser:
      return {...state, isAuthenticated: true, user: action.payload.user}
    default:
      return state
  }
}
