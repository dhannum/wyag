import commandLineArgs from 'command-line-args'
import { commandInit } from './command/init.js'
import { commandCatFile } from './command/catFile.js'
import { commandHashObject } from './command/hashObject.js'

const mainDefinitions = [{ name: 'command', defaultOption: true }]
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || []

switch (mainOptions.command) {
    // case 'add':
    //     commandAdd(argv)
    //     break
    case 'cat-file':
        commandCatFile(argv)
        break
    // case 'check-ignore':
    //     commandCheckIgnore(argv)
    //     break
    // case 'checkout':
    //     commandCheckout(argv)
    //     break
    // case 'commit':
    //     commandCommit(argv)
    //     break
    case 'hash-object':
        commandHashObject(argv)
        break
    case 'init':
        commandInit(argv)
        break
    // case 'log':
    //     commandLog(argv)
    //     break
    // case 'ls-files':
    //     commandLsFiles(argv)
    //     break
    // case 'ls-tree':
    //     commandLsTree(argv)
    //     break
    // case 'rev-parse':
    //     commandRevParse(argv)
    //     break
    // case 'rm':
    //     commandRm(argv)
    //     break
    // case 'show-ref':
    //     commandShowRef(argv)
    //     break
    // case 'status':
    //     commandStatus(argv)
    //     break
    // case 'tag':
    //     commandTag(argv)
    //     break
    default:
        console.log('Bad command.')
}
