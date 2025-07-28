import tsconfigPaths from 'vite-tsconfig-paths';
import { type Plugin, defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths() as Plugin],
    test: {
        clearMocks: true,
        exclude: ['node_modules', 'dist', 'build', 'e2e'],
        globals: true,
        setupFiles: ['./src/test/setup-global.ts'],
        typecheck: {
            enabled: true,
            include: ['./scripts/**/*.test.ts', './src/**/*.test.ts'],
            tsconfig: './tsconfig.test.json',
        },
    },
});
