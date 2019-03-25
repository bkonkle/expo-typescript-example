import gql from 'graphql-tag'
import {omit} from 'ramda'

import {
  Account, ApiAccount, AccountTypes, Address, Caregiver, Option, ServiceTypes,
} from '../Types'

/***
 * Fragments
 */

export const AddressData = gql`
  fragment AddressData on Address {
    id
    line1
    line2
    city
    state
    country
    postalCode
    location {
      x
      y
    }
  }
`

export const AccountData = gql`
  fragment AccountData on Account {
    id
    accountType
    serviceType
    attributes
    mailingList
    user
    addressByAddress {
      ...AddressData
    }
  }
  ${AddressData}
`

/**
 * CreateAccount
 */

export interface CreateAccountInput {
  input: {
    account: {
      accountType: AccountTypes,
      serviceType?: ServiceTypes,
      attributes?: string,
      mailingList?: boolean,
      user: string,
      address?: string,
    },
    clientMutationId?: string,
  }
}

export const CreateAccount = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      clientMutationId
      account {
        ...AccountData
      }
    }
  }
  ${AccountData}
`

export interface CreateAccountData {
  createAccount?: {
    clientMutationId?: string,
    account?: ApiAccount,
  },
}

/**
 * UpdateAccount
 */

export interface UpdateAccountInput {
  input: {
    id: string,
    accountPatch: {
      accountType?: AccountTypes,
      serviceType?: ServiceTypes,
      attributes?: string,
      mailingList?: boolean,
      address?: string,
    },
    clientMutationId?: string, 
  }
}

export const UpdateAccount = gql`
  mutation updateAccountById($input: UpdateAccountByIdInput!) {
    updateAccountById(input: $input) {
      clientMutationId
      account {
        ...AccountData
      }
    }
  }
  ${AccountData}
`

export interface UpdateAccountData {
  updateAccountById?: {
    clientMutationId?: string,
    account?: ApiAccount,
  },
}

/**
 * ListAccounts
 */

export interface ListAccountsInput {
  condition?: {
    accountType?: AccountTypes,
  },
}

export const ListAccounts = gql`
  query allAccounts($condition: AccountCondition) {
    allAccounts(condition: $condition) {
      nodes {
        ...AccountData
      }
    }
  }
  ${AccountData}
`

export interface ListAccountsData {
  allAccounts?: {
    nodes: ApiAccount[],
  },
}

/**
 * CreateAddress
 */

export interface CreateAddressInput {
  input: {
    address: Partial<Address>,
    clientMutationId?: string,
  }
}

export const CreateAddress = gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      clientMutationId
      address {
        ...AddressData
      }
    }
  }
  ${AddressData}
`

export interface CreateAddressData {
  createAddress?: {
    clientMutationId?: string,
    address: Address,
  }
}

/**
 * UpdateAddress
 */

export interface UpdateAddressInput {
  input: {
    id: string,
    addressPatch: Partial<Address>,
    clientMutationId?: string,
  }
}

export const UpdateAddress = gql`
  mutation updateAddressById($input: UpdateAddressByIdInput!) {
    updateAddressById(input: $input) {
      clientMutationId
      address {
        ...AddressData
      }
    }
  }
  ${AddressData}
`

export interface UpdateAddressData {
  updateAddressById?: {
    clientMutationId?: string,
    address: Address,
  }
}

/***
 * Utilities
 */

export function apiAccountToAccount (apiAccount: ApiAccount): Account {
  return {
    ...omit(['addressByAddress'], apiAccount),
    attributes: apiAccount.attributes && JSON.parse(apiAccount.attributes),
    address: apiAccount.addressByAddress && {
      ...apiAccount.addressByAddress,
    },
  }
}

export function accountToCaregiver (
  options: Option[] | undefined, account: Account
): Caregiver | undefined {
  const {id, address, attributes} = account
  const {needs: specialNeeds, specializations} = accountToNeedsSpecializations(
    account, options
  )
  
  if (!attributes) {
    console.warn('Unable to load attributes for caregiver:', account)

    return
  }

  const {avatar, displayName, headline, bio, rate} = attributes
  const location = address && address.city
  
  // Don't include records without a displayName
  return displayName && displayName !== ''
    ? {
      id,
      name: displayName,
      location,
      headline,
      bio,
      avatar,
      specialNeeds,
      specializations,
      rate,
    }
    : undefined
}

export const mapAccountToCaregiver = (options?: Option[]) => (account: Account) => {
  return accountToCaregiver(options, account)
}

export function accountsToCaregivers (accounts: Account[], options?: Option[]): Caregiver[] {
  return accounts.map(mapAccountToCaregiver(options)).filter(Boolean) as Caregiver[]
}

export function findNeedsSpecializationsLabels (
  needs: string[], specializations: string[], options?: Option[]
) {
  function findOption (need: string) {
    const option = options && options.find(opt => opt.id === need)
    
    return option && option.name
  }

  return {
    needs: needs.map(findOption).filter(Boolean) as string[],
    specializations: specializations.map(findOption).filter(Boolean) as string[],
  }
}

export function accountToNeedsSpecializations (account?: Account, options?: Option[]) {
  const attributes = account && account.attributes
  const needs = (attributes && attributes.specialNeeds) || []
  const specializations = (attributes && attributes.specializations) || []

  return findNeedsSpecializationsLabels(needs, specializations, options)
}
