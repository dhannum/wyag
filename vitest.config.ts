import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
            include: ['src/**'],
            exclude: ['src/wyag.ts'],
        },
        setupFiles: `test/unit/vitest.setup.ts`,
    },
})
