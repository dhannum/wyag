import { GitRepository } from '../repository.js'
import path from 'node:path'

export const commandInit = (args: Array<string>) => {
    const root = args[0] || '.'

    const repo = new GitRepository(path.join(process.cwd(), root), true)
    repo.create()
}
