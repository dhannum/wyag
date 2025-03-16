import { GitRepository } from '../repository.js'
import commandLineArgs from 'command-line-args'
import { objectFind, objectRead } from '../object/utils.js'

export const commandCatFile = (args: Array<string>) => {
    const commandDefinition = [{ name: 'positionals', defaultOption: true, multiple: true }]
    const commandOptions = commandLineArgs(commandDefinition, { argv: args })

    const repo = GitRepository.repoFind(process.cwd())

    if (!repo) {
        throw new Error('Not a git repository')
    }

    if (!commandOptions.positionals || commandOptions.positionals.length < 2) {
        throw new Error('must provide both type and object')
    }

    const [type, object] = commandOptions.positionals
    const obj = objectRead(repo, objectFind(repo, object, type))

    if (!obj) {
        throw new Error(`Unknown git object ${object}`)
    }

    console.log(obj.serialize())
}
