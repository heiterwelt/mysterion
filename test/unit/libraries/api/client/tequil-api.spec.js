import TequilApi from '../../../../../src/libraries/api/client/tequil-api'
import IdentityDTO from '../../../../../src/libraries/api/client/dto/identity'
import ProposalDTO from '../../../../../src/libraries/api/client/dto/proposal'
import AxiosAdapter from '../../../../../src/libraries/api/client/adapters/axios-adapter'
import axios from 'axios/index'
import MockAdapter from 'axios-mock-adapter'
import {capturePromiseError} from '../../../../helpers/utils'
import NodeHealthcheckDTO from '../../../../../src/libraries/api/client/dto/node-healthcheck'

describe('tequilAPI', () => {
  let api
  let mock
  beforeEach(() => {
    const axioInstance = axios.create()
    api = new TequilApi(new AxiosAdapter(axioInstance))
    mock = new MockAdapter(axioInstance)
  })

  describe('client.healthcheck()', () => {
    it('returns response', async () => {
      const response = {
        uptime: '1h10m',
        process: 1111,
        version: {
          commit: '0bcccc',
          branch: 'master',
          buildNumber: '001'
        }
      }
      mock.onGet('healthcheck').reply(200, response)

      const healthcheck = await api.healthCheck()
      expect(healthcheck).to.deep.equal(new NodeHealthcheckDTO(response))
    })

    it('throws network error', async () => {
      mock.onGet('/healthcheck').networkError()

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.eql('Network Error')
    })

    it('throws timeout', async () => {
      mock.reset()
      mock.onGet('/healthcheck').timeout()

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.match(/timeout of .*ms exceeded/)
    })

    it('throws 404', async () => {
      mock.reset()
      mock.onGet('/healthcheck').reply(404, {message: 'What is wrong'})

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.eql('Request failed with status code 404')
      expect(err.response.data.message).to.eql('What is wrong')
    })
  })

  describe('client.stop()', () => {
    it('success', async () => {
      mock.onPost('stop').reply(200)

      const response = await api.stop()
      expect(response).to.be.undefined
    })

    it('handles error', async () => {
      mock.onPost('stop').reply(500)

      const e = await capturePromiseError(api.stop())
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })

  describe('client.findProposals()', () => {
    it('returns proposal DTOs', async () => {
      const response = {
        proposals: [{
          id: 1,
          providerId: '0x0',
          serviceType: 'openvpn',
          serviceDefinition: {
            locationOriginate: {
              asn: '',
              country: 'NL'
            }
          }
        }, {
          id: 1,
          providerId: '0x1',
          serviceType: 'openvpn',
          serviceDefinition: {
            locationOriginate: {
              asn: '',
              country: 'LT'
            }
          }
        }]
      }
      mock.onGet('proposals').reply(200, response)

      const proposals = await api.findProposals()
      expect(proposals).to.have.lengthOf(2)
      expect(proposals[0]).to.deep.equal(new ProposalDTO(response.proposals[0]))
      expect(proposals[1]).to.deep.equal(new ProposalDTO(response.proposals[1]))
    })

    it('handles error', async () => {
      mock.onGet('proposals').reply(500)

      const e = await capturePromiseError(api.findProposals())
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })

  describe('client.identitiesList()', () => {
    it('returns identity DTOs', async () => {
      const response = [
        {id: '0x1000FACE'},
        {id: '0x2000FACE'}
      ]
      mock.onGet('identities').reply(200, response)

      const identities = await api.identitiesList()
      expect(identities).to.have.lengthOf(2)
      expect(identities[0]).to.deep.equal(new IdentityDTO(response[0]))
      expect(identities[1]).to.deep.equal(new IdentityDTO(response[1]))
    })

    it('handles error', async () => {
      mock.onGet('identities').reply(500)

      const e = await capturePromiseError(api.identitiesList())
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })

  describe('client.identityCreate()', () => {
    it('create identity', async () => {
      const response = {id: '0x0000bEEF'}
      mock.onPost('identities', {passphrase: 'test'}).reply(200, response)

      const identity = await api.identityCreate('test')
      expect(identity).to.deep.equal(new IdentityDTO(response))
    })

    it('handles error', async () => {
      mock.onPost('identities').reply(500)

      const e = await capturePromiseError(api.identityCreate('test'))
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })

  describe('client.identityUnlock()', () => {
    it('create identity', async () => {
      mock.onPut('identities/0x0000bEEF/unlock', {passphrase: 'test'}).reply(200)

      const identity = await api.identityUnlock('0x0000bEEF', 'test')
      expect(identity).to.be.undefined
    })

    it('handles error', async () => {
      mock.onPut('identities/0x0000bEEF/unlock').reply(500)

      const e = await capturePromiseError(api.identityUnlock('0x0000bEEF', 'test'))
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })
})
