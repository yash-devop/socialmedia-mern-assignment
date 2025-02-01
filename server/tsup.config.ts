import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/server.ts'],
    outDir: 'dist',
    format: ['cjs'],
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: true,
  }
]);
