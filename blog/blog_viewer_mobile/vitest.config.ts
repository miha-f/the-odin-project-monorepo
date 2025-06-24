import { defineConfig, mergeConfig } from 'vitest/config'
import { createVitestConfig } from '@lynx-js/react/testing-library/vitest-config'

import path from 'path';

const defaultConfig = await createVitestConfig()
const config = defineConfig({
    test: {},
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})

export default mergeConfig(defaultConfig, config)
