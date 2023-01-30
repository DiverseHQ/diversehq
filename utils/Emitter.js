import EventEmitter from 'eventemitter3'

const emitter = new EventEmitter()
const Emitter = {
  on: (event, callback) => emitter.on(event, callback),
  once: (event, callback) => emitter.once(event, callback),
  off: (event, callback) => emitter.off(event, callback),
  emit: (event, ...args) => emitter.emit(event, ...args)
}

Object.freeze(Emitter)

export default Emitter
