import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Button as RNEButton, ButtonProps} from 'react-native-elements'

import {Colors} from '../Theme'

const Styles = StyleSheet.create({
  title: {
    color: Colors.white,
  },
})

export interface Props extends ButtonProps {
  large?: boolean,
  small?: boolean,
  width?: number | string,
}

export default class Button extends Component<Props> {
  render () {
    const {large, small, width, titleStyle, ...rest} = this.props

    // Use spreads to avoid adding keys unless there is an override
    const renderStyles = StyleSheet.create({
      title: {
        ...(large ? {fontSize: 24} : {}),
        ...(small ? {fontSize: 15} : {}),
        ...(width ? {width} : {}),
      },
    })

    return (
      <RNEButton
        type="clear"
        {...rest}
        titleStyle={[Styles.title, renderStyles.title, titleStyle]}
      />
    )
  }
}
