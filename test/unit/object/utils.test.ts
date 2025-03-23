import { beforeEach, expect, test, vi, describe } from 'vitest'
import { vol } from 'memfs'
import { GitRepository } from '../../../src/repository.js'
import { GitBlob } from '../../../src/object/blob.js'
import { objectRead, objectWrite } from '../../../src/object/utils.js'
import path from 'node:path'
import zlib, { deflateSync } from 'node:zlib'

// all 3 of these came from the official git repo so they are correct
const rawFileText = `#+TITLE: Write yourself a Git!

Source repository for the [[https://wyag.thb.lt][Write yourself a Git]] article.

Wyag is a [[https://en.wikipedia.org/wiki/Literate_programming][literate program]] written in [[https://orgmode.org/][org-mode]], which means the same source document can be used to produce the HTML version of the article as published on [[https://wyag.thb.lt]] and the program itself.  You only need a reasonably recent Emacs and the =make= program, then:

#+begin_src shell
  $ git clone --recursive https://github.com/thblt/write-yourself-a-git
  $ cd write-yourself-a-git
  $ make all
#+end_src
`

const expectedSha = 'e0695f14a412c29e252c998c81de1dde59658e4a'

const expectedDataB64 = `eAFtkk9r4zAQxffsT/GW9JbaZlnYQ6DH0i6kpwbCYkwZyxNbVH+MJCfk2+/IdWgPPWpG+s17b9QZ3+HPr98/NtvD38P+cYdj0Ilx9XOIbE4gPOn0syhepaAYgScfdfLhipMPSCOjacaUprir68uVhiqNXWVS23zHaVtQSFoZroriKLeho0z4JLCrLvpdT9xrqnwY6nyq96IoUOK3KfghkLXaDW1j1irWqsAvoj2xg3ZfmIKxvucF1zZyKvOxbe9xGbUaYZlcXJxEsoz4YbT3arbsEhQ5dIw5co/k87B+liCy8+fDyx5nDlF7B39aaqs/UMQ0d0bHUd5J+9Pj15QkDydYYa0moFOOvQL++VnemSscC4EkeYreUSeVwCore7SkJL4V8GDpnR9unPsMdbui2Gw7HrR7i0FBtBhTAHcYtBgz3jHKUmiya31m3PYo3XHuKuVtLds0qc65cnn7EyWVcmPhqH7J/Nte1gOSgZstuz4LKP4DCa3aoQ==`

describe('foo', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vol.reset()
    })

    test('write object to disk', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        repo.create()

        const sha = objectWrite(repo, new GitBlob(rawFileText))

        expect(sha).toEqual(expectedSha)

        const objPath = path.join(repo.gitDir, 'objects', sha.substring(0, 2), sha.substring(2))
        expect(vol.existsSync(objPath))

        const deflated = zlib.inflateSync(vol.readFileSync(objPath)).toString()

        expect(deflated).toEqual(`blob ${rawFileText.length}\0${rawFileText}`)
    })

    test('write object but just return hash', () => {
        const sha = objectWrite(undefined, new GitBlob(rawFileText))

        expect(sha).toEqual(expectedSha)
    })

    test('read object from disk', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        repo.create()

        vol.mkdirSync('/somewhere/.git/objects/e0')
        vol.writeFileSync(
            '/somewhere/.git/objects/e0/695f14a412c29e252c998c81de1dde59658e4a',
            Buffer.from(expectedDataB64, 'base64'),
        )

        const obj = objectRead(repo, expectedSha)

        expect(obj!.serialize()).toEqual(rawFileText)
    })

    test('read malformed objects with various failure cases', () => {
        vol.fromJSON({}, '/somewhere')

        const repo = new GitRepository('/somewhere', true)
        repo.create()

        vol.mkdirSync('/somewhere/.git/objects/e0')
        vol.writeFileSync('/somewhere/.git/objects/e0/noZero', deflateSync('blob 3foo'))
        vol.writeFileSync('/somewhere/.git/objects/e0/noLen', deflateSync('blob\0foo'))
        vol.writeFileSync('/somewhere/.git/objects/e0/badLen', deflateSync('blob pi\0foo'))
        vol.writeFileSync('/somewhere/.git/objects/e0/wrongLen', deflateSync('blob 4\0foo'))
        vol.writeFileSync('/somewhere/.git/objects/e0/badType', deflateSync('??? 3\0foo'))

        expect(objectRead(repo, 'badSha')).toBeUndefined()
        expect(() => objectRead(repo, 'e0noZero')).toThrowError(
            /Malformed object at.*, no zero byte/,
        )
        expect(() => objectRead(repo, 'e0noLen')).toThrowError(
            /Malformed object at.*, missing length/,
        )
        expect(() => objectRead(repo, 'e0badLen')).toThrowError(
            /Malformed object at.*, unparseable length.*/,
        )
        expect(() => objectRead(repo, 'e0wrongLen')).toThrowError(
            /Malformed object at.*, header and blob lengths don't match.*/,
        )
        expect(() => objectRead(repo, 'e0badType')).toThrowError(
            /Malformed object at.*, invalid type.*/,
        )
    })
})
