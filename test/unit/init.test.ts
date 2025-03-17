import { expect, test } from 'vitest'
import { commandInit } from '../../src/command/init.js'

test('init', () => {
    expect(() => commandInit([''])).toThrowError()
})
