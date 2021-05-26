import { createHmac } from 'crypto'
import ApiCall from './ApiCall'

const RESOURCEPATH = '/keys'

export default class Keys {
  constructor(private apiCall: ApiCall) {
    this.apiCall = apiCall
  }

  create(params: any) {
    return this.apiCall.post(Keys.RESOURCEPATH, params)
  }

  retrieve() {
    return this.apiCall.get(RESOURCEPATH)
  }

  generateScopedSearchKey(searchKey: string, parameters: any) {
    // Note: only a key generated with the `documents:search` action will be
    // accepted by the server, when usined with the search endpoint.
    const paramsJSON = JSON.stringify(parameters)
    const digest = Buffer.from(createHmac('sha256', searchKey).update(paramsJSON).digest('base64'))
    const keyPrefix = searchKey.substr(0, 4)
    const rawScopedKey = `${digest}${keyPrefix}${paramsJSON}`

    return Buffer.from(rawScopedKey).toString('base64')
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH
  }
}
