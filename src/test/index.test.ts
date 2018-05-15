import * as assert from 'assert'
import * as mutator from '../index'

function sleep(ns) {
  return new Promise(resolve => setTimeout(resolve, ns))
}

// describe('setIn', () => {
//   it('simple', () => {

//   })
// })
