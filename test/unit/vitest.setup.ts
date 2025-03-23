import { vi } from 'vitest'

vi.mock('node:fs', async () => {
    const memfs = await vi.importActual<typeof import('memfs')>('memfs')
    return {
        ...memfs.fs,
        default: memfs.fs, // Ensure it behaves as a default and named export module
        __esModule: true, // Make it ESM-friendly
    }
})
