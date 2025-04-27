import type { GitRepository } from '../repository.js'
import path from 'node:path'
import fs from 'fs'
import zlib from 'node:zlib'
import { GitBlob } from './blob.js'
import crypto from 'crypto'
import type { GitObject } from './object.js'
import { GitCommit } from './commit.js'
import { TextEncoder } from 'node:util'

export const objectRead = (repo: GitRepository, sha: string): GitObject | undefined => {
    const file = path.join(repo.gitDir, 'objects', sha.substring(0, 2), sha.substring(2))

    if (!fs.existsSync(file)) return undefined

    // get raw contents
    const rawContents = fs.readFileSync(file)
    const unzipped = zlib.inflateSync(rawContents).toString()

    // get type and validate length
    const zeroIndex = unzipped.indexOf('\0')
    if (zeroIndex === -1) throw Error(`Malformed object at ${file}, no zero byte`)
    const headerSplit = unzipped.substring(0, zeroIndex).split(' ')
    const type = headerSplit[0]!
    if (headerSplit.length < 2) throw Error(`Malformed object at ${file}, missing length`)
    const length = Number.parseInt(headerSplit[1]!)
    if (isNaN(length))
        throw Error(`Malformed object at ${file}, unparseable length ${headerSplit[1]}`)

    const blob = unzipped.substring(zeroIndex + 1)

    if (new TextEncoder().encode(blob).length !== length)
        throw Error(
            `Malformed object at ${file}, header and blob lengths don't match ${length} != ${blob.length}`,
        )

    switch (type) {
        case 'commit':
            return new GitCommit(blob)
        case 'tree':
        case 'tag':
        case 'blob':
            return new GitBlob(blob)
        default:
            throw new Error(`Malformed object at ${file}, invalid type ${type}`)
    }
}

export const objectWrite = (repo: GitRepository | undefined, object: GitObject): string => {
    const data = object.serialize()

    const fullData = `${object.fmt} ${data.length}\0${data}`

    const sha = crypto.createHash('sha1').update(fullData).digest('hex')

    if (repo) {
        const file = path.join(repo.gitDir, 'objects', sha.substring(0, 2), sha.substring(2))

        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, zlib.deflateSync(fullData), 'utf8')
    }

    return sha
}

export const objectFind = (
    repo: GitRepository,
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    format?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    follow?: boolean,
) => {
    return name
}
