import { beforeEach, expect, test, vi, describe, type MockedClass } from 'vitest'
import { GitRepository } from '../../../src/repository.js'
import { objectWrite } from '../../../src/object/utils.js'
import { commandHashObject } from '../../../src/command/hashObject.js'

vi.mock('../../../src/repository.js', () => {
    const GitRepositoryMock = vi.fn() as unknown as MockedClass<typeof GitRepository>
    GitRepositoryMock.repoFind = vi.fn()
    return { GitRepository: GitRepositoryMock }
})

vi.mock('../../../src/object/utils.js', () => ({
    objectWrite: vi.fn(),
}))

vi.mock('fs', () => ({
    readFileSync: vi.fn().mockImplementation(() => 'testFile'),
}))

const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('hash-object command', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('happy path, hash and write', () => {
        const sha = '1234'
        const repo = new GitRepository('/tmp/foo', true)
        vi.mocked(GitRepository.repoFind).mockReturnValue(repo)
        vi.mocked(objectWrite).mockReturnValue(sha)

        commandHashObject(['-t', 'blob', '-w', 'foo.txt'])

        expect(consoleLogSpy).toBeCalledWith(sha)
    })

    test('works with no repo if -w is not set', () => {
        const sha = '1234'
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)
        vi.mocked(objectWrite).mockReturnValue(sha)

        commandHashObject(['-t', 'blob', 'foo.txt'])

        expect(consoleLogSpy).toBeCalledWith(sha)
    })

    test("doesn't work with no repo if -w is set", () => {
        const sha = '1234'
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)
        vi.mocked(objectWrite).mockReturnValue(sha)

        expect(() => commandHashObject(['-t', 'blob', '-w', 'foo.txt'])).toThrowError(
            'Not a git repository',
        )
    })

    test('fails with missing type', () => {
        const sha = '1234'
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)
        vi.mocked(objectWrite).mockReturnValue(sha)

        expect(() => commandHashObject(['foo.txt'])).toThrowError('Unknown type')
    })

    test('fails with unknown type', () => {
        const sha = '1234'
        vi.mocked(GitRepository.repoFind).mockReturnValue(undefined)
        vi.mocked(objectWrite).mockReturnValue(sha)

        expect(() => commandHashObject(['-t', 'foo', 'foo.txt'])).toThrowError('Unknown type')
    })
})
