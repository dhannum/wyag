import { beforeEach, describe, expect, test, vi } from 'vitest'
import { vol } from 'memfs'
import { CONTENT_KEY, kvlmParse, kvlmSerialize } from '../../../src/object/kvlm.js'

describe('kvlm', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vol.reset()
    })

    test('parse a kvlm', () => {
        const raw = `tree 1234\nparent abcd\nauthor me 1735993987 +0100\ncommitter you 1735993987 +0100\n\nwhole big object contents\n`

        const parsed = kvlmParse(raw, 0, new Map())

        expect(parsed.get('parent')).toBe('abcd')
        expect(parsed.get('author')).toBe('me 1735993987 +0100')
        expect(parsed.get('committer')).toBe('you 1735993987 +0100')
        expect(parsed.get('tree')).toBe('1234')
        expect(parsed.get(CONTENT_KEY)).toBe('whole big object contents\n')
    })

    test('parse a kvlm with duplicate keys', () => {
        const raw = `tree 1234\nparent abcd\nparent efgh\nparent ijkl\nauthor me 1735993987 +0100\n another author\ncommitter you 1735993987 +0100\n\nwhole big object contents\n`

        const parsed = kvlmParse(raw, 0, new Map())

        expect(parsed.get('parent')).toStrictEqual(['abcd', 'efgh', 'ijkl'])
        expect(parsed.get('author')).toBe('me 1735993987 +0100\nanother author')
        expect(parsed.get('committer')).toBe('you 1735993987 +0100')
        expect(parsed.get('tree')).toBe('1234')
        expect(parsed.get(CONTENT_KEY)).toBe('whole big object contents\n')
    })

    test('parse malformed klvm with no content', () => {
        const raw = `tree 1234\n`

        expect(() => kvlmParse(raw, 0, new Map())).toThrowError('unparseable kvlm')
    })

    test('bidirection parse/serialize', () => {
        const raw = `tree 1234\nparent abcd\nparent efgh\nauthor me 1735993987 +0100\n another author\ncommitter you 1735993987 +0100\n\nwhole big object contents\n`

        const parsed = kvlmParse(raw, 0, new Map())

        const serialized = kvlmSerialize(parsed)

        expect(raw).toBe(serialized)
    })
})
