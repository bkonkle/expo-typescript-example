import {createStackNavigator, createAppContainer} from 'react-navigation'

/**
 * Users
 */
import Login from './screens/user/LoginScreen'

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {title: 'Login'},
  },
}, {initialRouteName: 'Login', headerMode: 'none'})

export default createAppContainer(AppNavigator)
