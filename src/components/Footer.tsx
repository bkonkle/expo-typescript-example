import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'

import {Units} from '../Theme'

const Styles = StyleSheet.create({
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Units.vh(5),
    paddingRight: Units.vw(10),
    paddingLeft: Units.vw(10),
  },
})

export default class Footer extends Component {
  render () {
    const {children} = this.props

    return <View style={Styles.footer}>{children}</View>
  }
}
