import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        clearMocks: true,
        exclude: ['node_modules', 'dist', 'build', 'e2e'],
        globals: true,
        setupFiles: ['./src/test/setup-global.ts'],
    },
});
