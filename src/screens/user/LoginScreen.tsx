/* tslint:disable no-require-imports */
import React, {Component} from 'react'
import {ImageSourcePropType, Image, View, StyleSheet} from 'react-native'

import {Colors, Units} from '../../Theme'
import Background from '../../components/Background'
import Login from '../../components/user/Login'

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: Units.vw(80),
    width: Units.vw(100),
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: Units.vh(5),
    marginTop: Units.vh(10),
  },
})

export default class LoginScreen extends Component {
  render () {
    return (
      <View style={Styles.container}>
        <Background />
        <Image
          source={require('../../../assets/logo.png') as ImageSourcePropType}
          style={Styles.logo}
        />
        <Login />
      </View>
    )
  }
}
