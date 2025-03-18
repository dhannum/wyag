import { beforeEach, expect, test, vi, describe } from 'vitest'
import { commandInit } from '../../src/command/init.js'
import { commandCatFile } from '../../src/command/catFile.js'
import { commandHashObject } from '../../src/command/hashObject.js'
import { cmd } from '../../src/cmd.js'

vi.mock('../../src/command/init.js', () => ({
    commandInit: vi.fn(),
}))

vi.mock('../../src/command/catFile.js', () => ({
    commandCatFile: vi.fn(),
}))

vi.mock('../../src/command/hashObject.js', () => ({
    commandHashObject: vi.fn(),
}))

describe('cmd runner', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('unknown command', () => {
        expect(() => cmd(['foobar'])).toThrowError('Bad command')
    })

    test('init', () => {
        vi.mocked(commandInit).mockReturnValue(undefined)

        cmd(['init'])
    })

    test('hash-object', () => {
        vi.mocked(commandHashObject).mockReturnValue(undefined)

        cmd(['hash-object'])
    })

    test('cat-file', () => {
        vi.mocked(commandCatFile).mockReturnValue(undefined)

        cmd(['cat-file'])
    })
})
