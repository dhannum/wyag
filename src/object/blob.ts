import { GitObject } from './object.js'

export class GitBlob extends GitObject {
    readonly fmt = 'blob'

    constructor(private blobData: string) {
        super()
    }

    override serialize = (): string => {
        return this.blobData
    }

    override deserialize = (data: string) => {
        this.blobData = data
    }
}
