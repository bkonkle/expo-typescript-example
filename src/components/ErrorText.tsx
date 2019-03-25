import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Text, TextProps} from 'react-native-elements'

import {Colors, Units} from '../Theme'

export interface Props extends TextProps {

}

export const Styles = StyleSheet.create({
  error: {
    color: Colors.red,
    fontSize: 18,
    marginLeft: Units.vh(2),
    height: 40,
  },
})

export default class ErrorText extends Component<Props> {
  render () {
    const {children, style, ...rest} = this.props

    return <Text {...rest} style={[Styles.error, style]}>{children}</Text>
  }
}
