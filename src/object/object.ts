export abstract class GitObject {
    abstract readonly fmt: string

    protected constructor(dataIn?: string) {
        if (dataIn) {
            this.deserialize(dataIn)
        } else {
            this.init()
        }
    }

    serialize = (): string => {
        throw Error('not implemented')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deserialize = (dataIn: string): void => {
        throw Error('not implemented')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init = (): any => {}
}
