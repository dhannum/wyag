import * as fs from 'fs'
import path from 'node:path'
import { readIniFileSync } from 'read-ini-file'
import { writeIniFileSync } from 'write-ini-file'

interface GitConfig {
    core: {
        repositoryformatversion: number
        filemode: boolean
        bare: boolean
    }
}

export class GitRepository {
    workTree: string
    gitDir: string
    conf: GitConfig

    defaultConf: GitConfig = {
        core: {
            repositoryformatversion: 0,
            filemode: false,
            bare: false,
        },
    }

    constructor(rootPath: string, force = false) {
        this.workTree = rootPath
        this.gitDir = path.join(this.workTree, '.git')

        if (!force && fs.existsSync(this.gitDir)) {
            throw new Error(`Not a Git repository ${path}`)
        }

        const configFilePath = path.join(this.gitDir, 'config')
        if (fs.existsSync(configFilePath)) {
            this.conf = readIniFileSync(configFilePath) as GitConfig
            if (this.conf.core.repositoryformatversion !== 0) {
                throw new Error(`Unsupported repositoryformatversion: ${8}`)
            }
        } else if (!force) {
            throw new Error('Configuration file missing')
        } else {
            this.conf = this.defaultConf
        }
    }

    create() {
        if (fs.existsSync(this.workTree) && fs.readdirSync(this.workTree).length > 0) {
            throw new Error('Git directory not empty already exists')
        }

        fs.mkdirSync(this.gitDir, { recursive: true })
        fs.mkdirSync(path.join(this.gitDir, 'objects'), { recursive: true })
        fs.mkdirSync(path.join(this.gitDir, 'branches'), { recursive: true })
        fs.mkdirSync(path.join(this.gitDir, 'refs', 'tags'), { recursive: true })
        fs.mkdirSync(path.join(this.gitDir, 'refs', 'heads'), { recursive: true })

        fs.writeFileSync(
            path.join(this.gitDir, 'description'),
            "Unnamed repository; edit this file 'description' to name the repository.\n",
        )
        fs.writeFileSync(path.join(this.gitDir, 'HEAD'), 'ref: refs/heads/master\n')

        writeIniFileSync(path.join(this.gitDir, 'config'), this.defaultConf)
    }
}
