import gql from 'graphql-tag'
import {omit} from 'ramda'

import {ApiUser, User} from '../Types'
import {AccountData, apiAccountToAccount} from './AccountData'

/***
 * Fragments
 */

export const UserData = gql`
  fragment UserData on User {
    id
    username
    isActive
    accountsByUser {
      nodes {
        ...AccountData
      }
    }
  }
  ${AccountData}
`

/***
 * Queries and Mutations
 */

/**
 * GetCurrentUser
 */

export interface GetCurrentUserInput {
  input: {
    clientMutationId?: string,
  }
}

export const GetCurrentUser = gql`
  mutation getCurrentUser ($input: GetCurrentUserInput!) {
    getCurrentUser (input: $input) {
      clientMutationId
      user {
        ...UserData
      }
    }
  }
  ${UserData}
`

export interface GetCurrentUserData {
  getCurrentUser?: {
    clientMutationId?: string,
    user?: ApiUser
  },
}

/***
 * Utilities
 */

export function apiUserToUser (apiUser: ApiUser): User {
  const apiAccount = apiUser.accountsByUser && apiUser.accountsByUser.nodes[0]

  return {
    ...omit(['accountsByUser'], apiUser),
    account: apiAccount && apiAccountToAccount(apiAccount),
  }
}
