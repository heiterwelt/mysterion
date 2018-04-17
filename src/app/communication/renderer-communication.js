// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeDTO, IdentitySetDTO, MysteriumClientLogDTO} from './dto'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendConnectionStatusChange (dto: ConnectionStatusChangeDTO): void {
    return this._send(messages.CONNECTION_STATUS_CHANGED, dto)
  }

  sendIdentitySet (dto: IdentitySetDTO): void {
    return this._send(messages.IDENTITY_SET, dto)
  }

  sendRendererLoaded (): void {
    return this._send(messages.RENDERER_LOADED)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogDTO) => void): void {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default RendererCommunication
