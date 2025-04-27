import { GitRepository } from '../repository.js'
import commandLineArgs from 'command-line-args'
import { objectFind, objectRead } from '../object/utils.js'
import type { GitCommit } from '../object/commit.js'
import { CONTENT_KEY } from '../object/kvlm.js'

export const commandLog = (args: Array<string>) => {
    const commandDefinition = [{ name: 'positionals', defaultOption: true, multiple: true }]
    const commandOptions = commandLineArgs(commandDefinition, { argv: args })

    const repo = GitRepository.repoFind(process.cwd())

    if (!repo) {
        throw new Error('Not a git repository')
    }

    const commit: string = commandOptions?.positionals?.at(0) ?? 'HEAD'

    console.log('digraph wyaglog{')
    console.log('  node[shape=rect]')
    log_graphviz(repo, objectFind(repo, commit), new Set())
    console.log('}')
}

const log_graphviz = (repo: GitRepository, sha: string, visited: Set<string>) => {
    if (visited.has(sha)) {
        return
    }
    visited.add(sha)

    const obj = objectRead(repo, sha)
    if (!obj) {
        throw new Error(`Unknown git object ${sha}`)
    }
    if (obj.fmt !== 'commit') {
        return
    }

    const commitObj = obj as GitCommit

    const message = ((commitObj.kvlm.get(CONTENT_KEY) as string) ?? '')
        .trim()
        .replaceAll('\\', '\\\\')
        .replaceAll('"', '\\"')
        .split('\n')[0]

    console.log(`  c_${sha} [label="${sha.substring(0, 7)}: ${message}"]`)

    if (!commitObj.kvlm.has('parent')) return

    const parents =
        commitObj.kvlm.get('parent') instanceof Array
            ? (commitObj.kvlm.get('parent') as string[])
            : [commitObj.kvlm.get('parent') as string]

    parents.forEach((p) => {
        console.log(`  c_${sha} -> c_${p};`)
        log_graphviz(repo, p, visited)
    })
}
