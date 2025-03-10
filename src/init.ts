import { GitRepository } from './repository.js'
import path from 'node:path'

export const commandInit = (args: Array<string>) => {
    // if (mainOptions.command === 'merge') {
    //     const mergeDefinitions = [
    //         { name: 'squash', type: Boolean },
    //         { name: 'message', alias: 'm' },
    //     ]
    //     const mergeOptions = commandLineArgs(mergeDefinitions, { argv })
    //
    //     console.log('\nmergeOptions\n============')
    //     console.log(mergeOptions)
    // }

    const root = args[0] || '.'

    const repo = new GitRepository(path.join(process.cwd(), root), true)
    repo.create()
}
