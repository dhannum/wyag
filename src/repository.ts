import * as fs from 'fs'
import path from 'node:path'
import { stringify, parse } from 'ini'

interface GitConfig {
    core: {
        repositoryformatversion: string
        filemode: boolean
        bare: boolean
    }
}

export class GitRepository {
    public readonly workTree: string
    public readonly gitDir: string
    public readonly conf: GitConfig

    defaultConf: GitConfig = {
        core: {
            repositoryformatversion: '0',
            filemode: false,
            bare: false,
        },
    }

    constructor(rootPath: string, force = false) {
        this.workTree = rootPath
        this.gitDir = path.join(this.workTree, '.git')

        if (!force && !fs.existsSync(this.gitDir)) {
            throw new Error(`Not a Git repository ${rootPath}`)
        }

        const configFilePath = path.join(this.gitDir, 'config')
        if (fs.existsSync(configFilePath)) {
            this.conf = parse(fs.readFileSync(configFilePath).toString()) as GitConfig
            if (Number.parseInt(this.conf.core.repositoryformatversion) !== 0) {
                throw new Error(
                    `Unsupported repositoryformatversion: ${this.conf.core.repositoryformatversion}`,
                )
            }
        } else if (!force) {
            throw new Error('Configuration file missing')
        } else {
            this.conf = this.defaultConf
        }
    }

    create() {
        if (fs.existsSync(this.workTree) && fs.readdirSync(this.workTree).length > 0) {
            throw new Error('Already a Git repository')
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

        fs.writeFileSync(path.join(this.gitDir, 'config'), stringify(this.defaultConf))
    }

    static repoFind(p: string): GitRepository | undefined {
        if (fs.existsSync(path.join(p, '.git'))) {
            return new GitRepository(p)
        } else {
            if (p === '/') return undefined
            return this.repoFind(path.dirname(p))
        }
    }
}
