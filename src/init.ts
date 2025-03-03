import { GitRepository } from './repository.js'

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
    console.log(args)
    new GitRepository(process.cwd(), true)
}
