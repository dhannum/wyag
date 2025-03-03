import * as fs from 'fs'
import path from 'node:path'
import { readIniFileSync } from 'read-ini-file'

export class GitRepository {
    workTree: string
    gitDir: string
    conf: object

    constructor(rootPath: string, force = false) {
        this.workTree = rootPath
        this.gitDir = path.join(this.workTree, '.git')

        if (!force && fs.existsSync(this.gitDir)) {
            throw new Error(`Not a Git repository ${path}`)
        }

        const configFilePath = path.join(this.gitDir, 'config')
        if (fs.existsSync(configFilePath)) {
            this.conf = readIniFileSync(configFilePath)
            if (this.conf['core'].['repositoryformatversion'] !== 0) {
                throw new Error(`Unsupported repositoryformatversion: ${8}`)
            }
            console.log(JSON.stringify(this.conf))
        } else if (!force) {
            throw new Error('Configuration file missing')
        } else {
            throw new Error('not implemented yet')
        }
    }
}
