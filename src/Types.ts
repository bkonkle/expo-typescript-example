import {Omit} from 'ramda'
import {NavigationInjectedProps} from 'react-navigation'
import {IMessage} from 'react-native-gifted-chat'

import {ReduxState} from './state/StateTypes'

export {ReduxState}

export enum OptionTypes {
  specialNeed = 'OPTION_TYPE_SPECIAL_NEED',
  specialization = 'OPTION_TYPE_SPECIALIZATION',
}

export interface Option {
  id: string
  type: OptionTypes
  name: string
}

export interface User {
  id: string
  username: string
  isActive: boolean
  account?: Account
}

export interface ApiUser extends Omit<User, 'account'> {
  accountsByUser: {
    nodes: ApiAccount[],
  }
}

export interface Address {
  id: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  location?: {x: number, y: number}
}

export enum AccountTypes {
  parentGuardian = 'ACCOUNT_TYPE_PARENT_GUARDIAN',
  caregiver = 'ACCOUNT_TYPE_CAREGIVER',
}

export enum ServiceTypes {
  childcare = 'SERVICE_TYPE_CHILDCARE',
  tutoring = 'SERVICE_TYPE_TUTORING',
}

export interface AccountAttributes {
  displayName?: string
  email?: string
  avatar?: string
  headline?: string
  bio?: string
  rate?: number
  specialNeeds?: string[]
  specializations?: string[]
}

export interface Account {
  id: string
  accountType: AccountTypes
  serviceType?: ServiceTypes
  attributes?: AccountAttributes
  mailingList?: boolean
  address?: Address
}

export interface ApiAccount extends Omit<Account, 'address' | 'attributes'> {
  attributes?: string
  addressByAddress?: Address
}

export interface AccountMock {
  email?: string
  password?: string
  displayName?: string
  city?: string
  accountType?: AccountTypes
  serviceType?: ServiceTypes
  specialNeeds: Option[]
  specializations: Option[]
  bio?: string
}

/**
 * A database representation of a user's account profile
 */
export interface Profile {
  id: string
  accountType: AccountTypes
  serviceType: ServiceTypes
  specialNeeds: string[]
  specializations: string[]
  bio?: string
  city?: string
  displayName?: string
  email?: string
  createdAt: string
  updatedAt: string
}

export interface Caregiver {
  id: string,
  name: string
  avatar?: string
  location?: string
  headline?: string
  bio?: string
  specialNeeds: string[]
  specializations: string[]
  rate?: number
}

export enum AppointmentTypes {
  care = 'APPOINTMENT_TYPE_CARE',
  tutoring = 'APPOINTMENT_TYPE_TUTORING',
  phone = 'APPOINTMENT_TYPE_PHONE',
  meet  = 'APPOINTMENT_TYPE_MEET',
}

export interface AppointmentAttributes {
  accepted?: boolean
  details?: string
}

export interface Appointment {
  id: string
  appointmentType: AppointmentTypes
  attributes?: AppointmentAttributes
  startDate: Date
  endDate?: Date
  from: Account
  to: Account
}

export interface ApiAppointment extends Omit<Appointment, 'attributes' | 'from' | 'to'> {
  attributes?: string
  accountByFrom: ApiAccount
  accountByTo: ApiAccount
}

export interface CareAppointment extends Appointment {
  type: AppointmentTypes.care,
}

export interface TutorAppointment extends Appointment {
  type: AppointmentTypes.tutoring,
}

export interface PhoneAppointment extends Appointment {
  type: AppointmentTypes.phone,
}

export interface MeetAppointment extends Appointment {
  type: AppointmentTypes.meet,
}

// Note: This is for the top-level state module for messages, which will be deprecated soon
export interface Messages {
  errors: string[]
  notifications: string[]
}

export interface MessageAttributes {
  system?: boolean
  read?: boolean
  appointmentId?: string
}

export interface Message {
  id: string
  text: string
  attributes?: MessageAttributes
  from: Account
  to: Account
  createdAt: Date
  updatedAt: Date
}

export interface ApiMessage extends Omit<Message, 'attributes'> {
  attributes?: string,
  accountByFrom: ApiAccount,
  accountByTo: ApiAccount,
}

export interface NavigationParams {
  caregiver?: Caregiver
  appointment?: Appointment
  accountType?: AccountTypes
  serviceType?: ServiceTypes
  chat?: {
    partner: Account
    isFrom: boolean
  }
}

export type NavigationProps = NavigationInjectedProps<NavigationParams>

export interface GiftedMessage extends IMessage {
  attributes: MessageAttributes
}
