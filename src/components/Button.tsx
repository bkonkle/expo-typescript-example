import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Button as RNEButton, ButtonProps} from 'react-native-elements'

import {Colors, Units} from '../Theme'

const Styles = StyleSheet.create({
  button: {
    height: 50,
    marginBottom: Units.vh(3),
    borderRadius: Units.vw(30),
    marginRight: Units.vw(9),
    marginLeft: Units.vw(9),
  },
})

export interface Props extends ButtonProps {
  full?: boolean,
  large?: boolean,
  secondary?: boolean,
  backgroundColor?: string,
}

export default class Button extends Component<Props> {
  render () {
    const {full, large, secondary, backgroundColor, titleStyle, buttonStyle, ...rest} = this.props

    const defaultBackground = {backgroundColor: secondary ? Colors.secondary : Colors.primary}

    // Use spreads to avoid adding keys unless there is an override
    const renderStyles = StyleSheet.create({
      title: {
        ...(full ? {width: '100%'} : {}),
        ...(large ? {fontSize: 24} : {}),
      },
      button: {
        ...(backgroundColor ? {backgroundColor} : defaultBackground),
      },
    })

    return (
      <RNEButton
        raised
        {...rest}
        titleStyle={[renderStyles.title, titleStyle]}
        buttonStyle={[Styles.button, renderStyles.button, buttonStyle]}
      />
    )
  }
}
