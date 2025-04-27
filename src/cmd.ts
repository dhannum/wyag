import commandLineArgs from 'command-line-args'
import { commandInit } from './command/init.js'
import { commandCatFile } from './command/catFile.js'
import { commandHashObject } from './command/hashObject.js'
import { commandLog } from './command/log.js'

export const cmd = (argv: string[]) => {
    const mainDefinitions = [{ name: 'command', defaultOption: true }]
    const mainOptions = commandLineArgs(mainDefinitions, { argv, stopAtFirstUnknown: true })
    const extraArgs = mainOptions._unknown || []

    switch (mainOptions.command) {
        // case 'add':
        //     commandAdd(extraArgs)
        //     break
        case 'cat-file':
            commandCatFile(extraArgs)
            break
        // case 'check-ignore':
        //     commandCheckIgnore(extraArgs)
        //     break
        // case 'checkout':
        //     commandCheckout(extraArgs)
        //     break
        // case 'commit':
        //     commandCommit(extraArgs)
        //     break
        case 'hash-object':
            commandHashObject(extraArgs)
            break
        case 'init':
            commandInit(extraArgs)
            break
        case 'log':
            commandLog(extraArgs)
            break
        // case 'ls-files':
        //     commandLsFiles(extraArgs)
        //     break
        // case 'ls-tree':
        //     commandLsTree(extraArgs)
        //     break
        // case 'rev-parse':
        //     commandRevParse(extraArgs)
        //     break
        // case 'rm':
        //     commandRm(extraArgs)
        //     break
        // case 'show-ref':
        //     commandShowRef(extraArgs)
        //     break
        // case 'status':
        //     commandStatus(extraArgs)
        //     break
        // case 'tag':
        //     commandTag(extraArgs)
        //     break
        default:
            throw Error(`Bad command ${mainOptions.command}`)
    }
}
