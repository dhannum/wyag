import { GitRepository } from '../repository.js'
import commandLineArgs from 'command-line-args'
import { GitObject } from '../object/object.js'
import * as fs from 'node:fs'
import { GitBlob } from '../object/blob.js'
import { objectWrite } from '../object/utils.js'
import { GitCommit } from '../object/commit.js'

export const commandHashObject = (args: Array<string>) => {
    const commandDefinition = [
        { name: 'type', alias: 't' },
        { name: 'write', alias: 'w', type: Boolean, defaultValue: false },
        { name: 'path', defaultOption: true },
    ]
    const commandOptions = commandLineArgs(commandDefinition, { argv: args })

    const repo = commandOptions.write ? GitRepository.repoFind(process.cwd()) : undefined

    if (commandOptions.write && !repo) {
        throw new Error('Not a git repository')
    }

    const objData = fs.readFileSync(commandOptions.path, 'utf8')

    let obj: GitObject
    switch (commandOptions.type) {
        case 'commit':
            obj = new GitCommit(objData)
            break
        case 'tree':
            obj = new GitBlob(objData)
            break
        case 'tag':
            obj = new GitBlob(objData)
            break
        case 'blob':
            obj = new GitBlob(objData)
            break
        default:
            throw new Error(`Unknown type: ${commandOptions.type}`)
    }

    console.log(objectWrite(repo, obj))
}
