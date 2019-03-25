import AWS from 'aws-sdk'

import Config from '../Config'

export interface SaveOptions {
  name: string,
  body: AWS.S3.Types.Body,
  username?: string,
  contentType?: string,
  level?: string,
  track?: boolean,
}

export class Aws {
  storage: AWS.S3

  constructor () {
    this.storage = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: Config.Aws.storageBucket},
      signatureVersion: 'v4',
      region: Config.Aws.region,
      credentials: {
        accessKeyId: Config.Aws.keyId,
        secretAccessKey: Config.Aws.secretKey,
      },
    })
  }

  saveFile = async (options: SaveOptions) => {
    const {username, body, contentType, name} = options
    
    const userString = username ? encodeURIComponent(username) : 'anonymous'
    const prefix = new Date().getTime()
    const key = `users/${userString}/${prefix}.${name}`

    const results = await this.storage.upload({
      Bucket: Config.Aws.storageBucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }).promise()

    return results.Location
  }
}

export default new Aws()
