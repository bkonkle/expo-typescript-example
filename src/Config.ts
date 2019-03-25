import {Constants} from 'expo'

const Config = {
  local: {
    Env: {
      isDev: true,
    },
    
    Api: {
      endpoint: 'http://localhost:8000/graphql',
    },
    
    Auth: {
      clientId: '##############################',
      domain: 'https://expo-typescript-dev.auth0.com',
      audience: 'localhost',
    },

    Aws: {
      region: 'us-west-2',
      keyId: '#####################',
      secretKey: '#################',
      storageBucket: 'expo-typescript-storage-dev',
    },
  },
  dev: {
    Env: {
      isDev: false,
    },
    
    Api: {
      endpoint: 'https://dev.expo-typescript.konkle.us/graphql',
    },
    
    Auth: {
      clientId: '##############################',
      domain: 'https://expo-typescript-dev.auth0.com',
      audience: 'dev',
    },

    Aws: {
      region: 'us-west-2',
      keyId: '#####################',
      secretKey: '#################',
      storageBucket: 'expo-typescript-storage-dev',
    },
  },
  beta: {
    Env: {
      isDev: false,
    },
    
    Api: {
      endpoint: 'https://beta.expo-typescript.konkle.us/graphql',
    },
    
    Auth: {
      clientId: '',
      domain: 'https://expo-typescript-beta.auth0.com',
      audience: 'beta',
    },

    Aws: {
      region: 'us-west-2',
      keyId: '#####################',
      secretKey: '#################',
      storageBucket: 'expo-typescript-storage-beta',
    },
  },
  prod: {
    Env: {
      isDev: false,
    },
    
    Api: {
      endpoint: 'https://expo-typescript.konkle.us/graphql',
    },
    
    Auth: {
      clientId: '',
      domain: 'https://expo-typescript.auth0.com',
      audience: 'prod',
    },

    Aws: {
      region: 'us-west-2',
      keyId: '#####################',
      secretKey: '#################',
      storageBucket: 'expo-typescript-storage-prod',
    },
  },
}

function getConfig () {
  switch (Constants.manifest.releaseChannel) {
    case 'dev':
      return Config.dev
    case 'beta':
      return Config.beta
    case 'prod':
      return Config.prod
    default:
      return Config.local
  }
}

export default getConfig()
