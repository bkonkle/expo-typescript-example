import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {LinearGradient} from 'expo'
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper'

import {Colors} from '../Theme'

export const Styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0 - getStatusBarHeight() - (isIphoneX ? 80 : 0),
  },
})

export default class Background extends Component {
  render () {
    return <LinearGradient style={Styles.gradient} colors={[Colors.background, Colors.aquarium]} />
  }
}
