import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { commandInit } from '../../src/command/init.js'
import { GitRepository } from '../../src/repository.js'

const mockCreate = vi.fn()

beforeEach(() => {
    vi.mock('../../src/repository.js')

    GitRepository.mockImplementation(function () {
        this.create = mockCreate
    })
})

afterEach(() => {
    vi.restoreAllMocks()
})

test('init works in current dir', () => {
    const mockCwd = '/tmp/foo'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)

    commandInit([''])

    expect(GitRepository).toHaveBeenCalledTimes(1)
    expect(GitRepository).toHaveBeenCalledWith(`${mockCwd}`, true)
    expect(mockCreate).toHaveBeenCalledTimes(1)
})

test('init works in provided dir', () => {
    const mockCwd = '/tmp/foo'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)

    commandInit(['work'])

    expect(GitRepository).toHaveBeenCalledTimes(1)
    expect(GitRepository).toHaveBeenCalledWith(`${mockCwd}/work`, true)
    expect(mockCreate).toHaveBeenCalledTimes(1)
})
