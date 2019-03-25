import React, {Component} from 'react'
import {connect} from 'react-redux'
import {StyleSheet, View} from 'react-native'
import {SocialIcon} from 'react-native-elements'
import {withNavigation, NavigationInjectedProps} from 'react-navigation'

import {Units, Colors} from '../../Theme'
import {
  State as Messages,
  Actions as MessageActions,
  Selectors as MessageSelectors,
} from '../../state/MessageState'
import {Actions as UserActions} from '../../state/UserState'
import Button from '../Button'
import Link from '../Link'
import Footer from '../Footer'
import {NavigationParams, User} from '../../Types'
import {ReduxState} from '../../state/StateTypes'
import ErrorText from '../ErrorText'
import {login, facebookLogin} from '../../data/AuthClient'

export interface Props extends NavigationInjectedProps<NavigationParams> {
  messages: Messages,
  pushError: typeof MessageActions.pushError,
  clearErrors: typeof MessageActions.clearErrors,
  refreshUser (): Promise<User | undefined>,
}

export interface State {
  loading: boolean,
  submitting: boolean,
}

export interface LoginOptions {
  facebook?: boolean
}

const Styles = StyleSheet.create({
  facebook: {
    marginTop: Units.vh(10),
    paddingLeft: Units.vw(10),
    paddingRight: Units.vw(10),
  },
  facebookFont: {
    fontSize: 23,
    fontWeight: 'normal',
  },
  title: {
    color: Colors.white,
  },
  footerContainer: {
    marginLeft: Units.vh(2),
    marginRight: Units.vh(2),
  },
})

export class Login extends Component<Props, State> {
  state: State = {loading: true, submitting: false}

  async componentDidMount () {
    try {
      await this.handleSuccess()
    } catch (_error) {
      this.setState({loading: false})
    }
  }

  render () {
    const {messages} = this.props
    const {loading, submitting} = this.state

    if (loading) return null // tslint:disable-line no-null-keyword
    
    const errorMessage = messages.errors.length > 0
      ? messages.errors.join(', ')
      : undefined

    return (
      <>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <SocialIcon
          button
          type="facebook"
          title="Sign In With Facebook"
          style={Styles.facebook}
          fontStyle={Styles.facebookFont}
          onPress={this.handleLogin({facebook: true})}
        />
        <Button
          full
          large
          type="clear"
          disabled={submitting}
          title="Login or Sign Up"
          titleStyle={Styles.title}
          onPress={this.handleLogin()}
        />

        <Footer>
          <View />
          <Link small title="Need help?" onPress={this.handleNeedHelp} />
        </Footer>
      </>
    )
  }

  private handleSuccess = async () => {
    const {refreshUser, navigation} = this.props

    // Now, load the user's data into Redux
    const user = await refreshUser()
      
    if (user) {
      if (user.account) {
        navigation.replace('Dashboard')
      } else {
        navigation.replace('AccountType')
      }
    } else {
      throw new Error('Something went wrong! Please try again later.')
    }
  }

  private handleLogin = (options: LoginOptions = {}) => async () => {
    const {clearErrors, pushError} = this.props
    this.setState({submitting: true})
    clearErrors()

    const success = await (options.facebook ? facebookLogin() : login())

    this.setState({submitting: false})

    if (success) {
      try {
        await this.handleSuccess()
      } catch (error) {
        pushError(error.message)
      }
    } else {
      pushError('Something went wrong! Please try again later.')
    }
  }

  private handleNeedHelp = () => {
    const {pushError} = this.props

    pushError('Sorry, help is not available yet!')
  }
}

export default withNavigation(
  connect(
    (state: ReduxState) => ({messages: MessageSelectors.getState(state)}),
    {
      refreshUser: UserActions.refreshUser,
      pushError: MessageActions.pushError,
      clearErrors: MessageActions.clearErrors,
    }
  )(Login)
)
