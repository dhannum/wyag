import { beforeEach, expect, test, vi, describe } from 'vitest'
import { vol } from 'memfs'
import { GitRepository } from '../../src/repository.js'

describe('GitRepository', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vol.reset()
    })

    test('construct object from existing repo', () => {
        const json = {
            './.git/config': '[core]\nrepositoryformatversion = 0\nfilemode = true\nbare = true',
        }
        vol.fromJSON(json, '/somewhere')

        const repo = new GitRepository('/somewhere')

        expect(repo.workTree).toBe('/somewhere')
        expect(repo.gitDir).toBe('/somewhere/.git')
        expect(repo.conf).toEqual({
            core: {
                repositoryformatversion: '0',
                filemode: true,
                bare: true,
            },
        })
    })

    test('constructor fail if wrong version', () => {
        const json = {
            './.git/config': '[core]\nrepositoryformatversion = 1\nfilemode = true\nbare = true',
        }
        vol.fromJSON(json, '/somewhere')

        expect(() => new GitRepository('/somewhere')).toThrowError(
            'Unsupported repositoryformatversion',
        )
    })

    test('constructor fail if no config file', () => {
        const json = {
            './.git/': null,
        }
        vol.fromJSON(json, '/somewhere')

        expect(() => new GitRepository('/somewhere')).toThrowError('Configuration file missing')
    })

    test('constructor fail if no .git dir', () => {
        vol.fromJSON({}, '/somewhere')

        expect(() => new GitRepository('/somewhere')).toThrowError('Not a Git repository')
    })

    test('constructor builds an empty object if no repo exists but force is true', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)

        expect(repo.workTree).toBe('/somewhere')
        expect(repo.gitDir).toBe('/somewhere/.git')
        expect(repo.conf).toEqual({
            core: {
                repositoryformatversion: '0',
                filemode: false,
                bare: false,
            },
        })
    })

    test('create empty repo happy path', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        repo.create()

        expect(vol.toJSON('/somewhere')).toEqual({
            '/somewhere/.git/objects': null,
            '/somewhere/.git/branches': null,
            '/somewhere/.git/refs/tags': null,
            '/somewhere/.git/refs/heads': null,
            '/somewhere/.git/description':
                "Unnamed repository; edit this file 'description' to name the repository.\n",
            '/somewhere/.git/HEAD': 'ref: refs/heads/master\n',
            '/somewhere/.git/config':
                '[core]\nrepositoryformatversion=0\nfilemode=false\nbare=false\n',
        })
    })

    test('fails to create if directory is already a repo', () => {
        const json = {
            './.git/config': '[core]\nrepositoryformatversion = 0\nfilemode = true\nbare = true',
        }
        vol.fromJSON(json, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        expect(() => repo.create()).toThrowError('Already a Git repository')
    })

    test('repofind can find root from deep in the tree', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        repo.create()
        vol.mkdirSync('/somewhere/foo/bar', { recursive: true })
        vol.writeFileSync('/somewhere/foo/bar/baz', 'blah')

        expect(GitRepository.repoFind('/somewhere/foo/bar/baz')!.workTree).toBe('/somewhere')
        expect(GitRepository.repoFind('/somewhere/foo')!.workTree).toBe('/somewhere')
        expect(GitRepository.repoFind('/somewhereElse')).toBeUndefined()
    })
})
