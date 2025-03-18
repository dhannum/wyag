export abstract class GitObject {
    abstract readonly fmt: string

    protected constructor(dataIn?: string) {
        if (dataIn) {
            this.deserialize(dataIn)
        } else {
            this.init()
        }
    }

    abstract serialize(): string

    abstract deserialize(dataIn: string): void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init = (): any => {}
}
