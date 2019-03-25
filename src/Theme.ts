import {Dimensions} from 'react-native'
import {min, max} from 'ramda'

export const Units = {
  vmin: min(
    Dimensions.get('screen').width / 100,
    Dimensions.get('screen').height / 100,
  ),
  vmax: max(
    Dimensions.get('screen').width / 100,
    Dimensions.get('screen').height / 100,
  ),
  vw: (multiplier: number) => multiplier * (Dimensions.get('screen').width / 100),
  vh: (multiplier: number) => multiplier * (Dimensions.get('screen').height / 100),
}

const aquaTint = 'rgb(198, 230, 225)'
const pop = 'rgb(125, 130, 188)'
const aquarium = 'rgb(111, 166, 178)'

export const Colors = {
  /* Base colors */
  gray: '#d3d3d3',
  darkGray: '#2F4F4F',
  lightGray: '#F4F4F4',
  mediumGray: '#BABABA',
  blue: '#2089dc',
  white: '#FFF',
  red: 'red',

  hinoki: 'rgb(239, 221, 183)',
  lightHinoki: 'rgb(255, 243, 231)',
  gris: 'rgb(166, 169, 168)',
  aquaTint,
  aquarium,
  deepSeaDive: 'rgb(84, 107, 112)',
  pop,

  facebookBlue: '#3b5998',

  /* Semantic color names */
  background: aquaTint,
  primary: pop,
  secondary: aquarium,
  error: 'red',
}

export default {
  Units,
  Colors,
}
