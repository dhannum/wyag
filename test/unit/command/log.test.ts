import { beforeEach, expect, test, vi, describe, type MockedClass } from 'vitest'
import { GitRepository } from '../../../src/repository.js'
import { objectRead, objectFind } from '../../../src/object/utils.js'
import { GitBlob } from '../../../src/object/blob.js'
import { commandLog } from '../../../src/command/log.js'
import { GitCommit } from '../../../src/object/commit.js'

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

describe('log command', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    test('happy path, provided sha', () => {
        const sha = '1234'
        const testObj = new GitCommit('test')
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectFind).mockReturnValue(sha)
        vi.mocked(objectRead).mockReturnValue(testObj)

        commandLog([sha])

        expect(consoleLogSpy).toHaveBeenCalledWith('digraph wyaglog{')
    })

    test('follows up the commit tree', () => {
        const c1 = new GitCommit(new Map([['parent', ['c2a', 'c2b']]]))
        const c2a = new GitCommit(new Map([['parent', 'c3']]))
        const c2b = new GitCommit(new Map([['parent', 'c3']]))
        const c3 = new GitCommit(new Map())
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectFind).mockImplementation((repo, name): string => {
            if (name === 'c1') return 'c1'
            else if (name === 'c2a') return 'c2a'
            else if (name === 'c2b') return 'c2b'
            else if (name === 'c3') return 'c3'
            else return '1234'
        })
        vi.mocked(objectRead).mockImplementation((repo, name) => {
            if (name === 'c1') return c1
            else if (name === 'c2a') return c2a
            else if (name === 'c2b') return c2b
            else if (name === 'c3') return c3
            else throw new Error('Unknown commit')
        })

        commandLog(['c1'])

        expect(consoleLogSpy).toHaveBeenCalledWith('digraph wyaglog{')
    })

    test('fails when sha not provided', () => {
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)

        // FIXME make this work with HEAD later
        expect(() => commandLog([])).toThrowError()
    })

    test('fails when no git repo', () => {
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)

        expect(() => commandLog(['onlyOne'])).toThrowError('Not a git repository')
    })

    test('stops when sha is not a commit', () => {
        const sha = '1234'
        const testObj = new GitBlob('test')
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectFind).mockReturnValue(sha)
        vi.mocked(objectRead).mockReturnValue(testObj)

        commandLog([sha])

        expect(consoleLogSpy).toHaveBeenCalledWith('digraph wyaglog{')
    })
})
