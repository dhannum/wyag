import { beforeEach, expect, test, vi } from 'vitest'
import { commandInit } from '../../src/command/init.js'
import { GitRepository } from '../../src/repository.js'

const mockRepository = {
    create: vi.fn(),
}

beforeEach(() => {
    vi.clearAllMocks()

    vi.mock('../../src/repository.js', () => {
        return {
            GitRepository: vi.fn().mockImplementation(() => mockRepository),
        }
    })
})

test('init works in current dir', () => {
    const mockCwd = '/tmp/foo'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)

    commandInit([''])

    expect(GitRepository).toHaveBeenCalledTimes(1)
    expect(GitRepository).toHaveBeenCalledWith(`${mockCwd}`, true)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
})

test('init works in provided dir', () => {
    const mockCwd = '/tmp/foo'
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)

    commandInit(['work'])

    expect(GitRepository).toHaveBeenCalledTimes(1)
    expect(GitRepository).toHaveBeenCalledWith(`${mockCwd}/work`, true)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
})
