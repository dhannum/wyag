export const CONTENT_KEY = 'content'

export const kvlmParse = (
    raw: string,
    pos: number,
    parsed: Map<string, string | string[]>,
): Map<string, string | string[]> => {
    const spc = raw.indexOf(' ', pos)
    const nl = raw.indexOf('\n', pos)

    // new line before space, so this is the content,  not a header
    if (spc < 0 || nl < spc) {
        parsed.set(CONTENT_KEY, raw.substring(pos + 1))
        return parsed
    }

    const key = raw.substring(pos, spc)

    const match = /\n[^ ]/.exec(raw.substring(pos))
    if (!match) {
        throw new Error(`unparseable kvlm ${raw.substring(spc + 1)})`)
    }
    const valueEnd = match.index + pos
    const value = raw.substring(spc + 1, valueEnd).replaceAll('\n ', '\n')

    if (parsed.get(key)) {
        const existing = parsed.get(key)!
        if (existing instanceof Array) {
            existing.push(value)
        } else {
            parsed.set(key, [existing, value])
        }
    } else {
        parsed.set(key, value)
    }

    return kvlmParse(raw, valueEnd + 1, parsed)
}

export const kvlmSerialize = (kv: Map<string, string | string[]>): string => {
    const lines = Array.from(kv.entries()).map(([k, v]) => {
        if (k === CONTENT_KEY) {
            return `\n${v}`
        }

        if (v instanceof Array) {
            return v.map((item) => `${k} ${item.replaceAll('\n', '\n ')}\n`).join('')
        } else {
            return `${k} ${v.replaceAll('\n', '\n ')}\n`
        }
    })
    return lines.join('')
}
