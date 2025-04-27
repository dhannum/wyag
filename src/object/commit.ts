import { GitObject } from './object.js'
import { kvlmParse, kvlmSerialize } from './kvlm.js'

export class GitCommit extends GitObject {
    readonly fmt = 'commit'

    kvlm: Map<string, string | string[]>

    constructor(rawData: string | Map<string, string | string[]>) {
        super()
        if (typeof rawData === 'string') {
            this.kvlm = new Map()
            this.deserialize(rawData)
        } else {
            this.kvlm = rawData
        }
    }

    override serialize = (): string => {
        return kvlmSerialize(this.kvlm)
    }

    override deserialize = (data: string) => {
        this.kvlm = kvlmParse(data, 0, new Map())
    }
}
