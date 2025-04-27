import { beforeEach, expect, test, vi, describe, type MockedClass } from 'vitest'
import { GitRepository } from '../../../src/repository.js'
import { commandCatFile } from '../../../src/command/catFile.js'
import { objectRead, objectFind } from '../../../src/object/utils.js'
import { GitBlob } from '../../../src/object/blob.js'

vi.mock('../../../src/repository.js', () => {
    const GitRepositoryMock = vi.fn() as unknown as MockedClass<typeof GitRepository>
    GitRepositoryMock.repoFind = vi.fn()
    return { GitRepository: GitRepositoryMock }
})

vi.mock('../../../src/object/utils.js', () => ({
    objectRead: vi.fn(),
    objectFind: vi.fn(),
}))

const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('cat-file command', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    test('happy path, provided sha and type', () => {
        const sha = '1234'
        const testObj = new GitBlob('test')
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectFind).mockReturnValue(sha)
        vi.mocked(objectRead).mockReturnValue(testObj)

        commandCatFile(['blob', sha])

        expect(consoleLogSpy).toHaveBeenCalledWith('test')
    })

    test('fails when both not provided', () => {
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)

        expect(() => commandCatFile(['onlyOne'])).toThrowError('must provide both type and object')
    })

    test('fails when no git repo', () => {
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)

        expect(() => commandCatFile(['onlyOne'])).toThrowError('Not a git repository')
    })

    test('fails when object not found', () => {
        const sha = '1234'
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectFind).mockReturnValue(sha)
        vi.mocked(objectRead).mockReturnValue(undefined)

        expect(() => commandCatFile(['blob', sha])).toThrowError('Unknown git object')
    })
})
