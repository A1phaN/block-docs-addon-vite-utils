import typescript from '@rollup/plugin-typescript';
import path from 'path';
import dts from 'rollup-plugin-dts';
import license from 'rollup-plugin-license';
import packageJson from './package.json' with { type: 'json' };
import type { RollupOptions } from 'rollup';

const external = Object.keys(packageJson.dependencies).concat('fs', 'path', '@lark-opdev/cli/libs/api');

export default [
  {
    input: './src/index.ts',
    external,
    output: {
      dir: 'lib',
      format: 'cjs',
    },
    plugins: [
      typescript(),
      license({
        banner: {
          content: {
            file: path.join(process.cwd(), 'LICENSE'),
          },
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    external,
    output: {
      dir: 'es',
      format: 'es',
    },
    plugins: [
      typescript(),
      license({
        banner: {
          content: {
            file: path.join(process.cwd(), 'LICENSE'),
          },
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    external,
    output: {
      dir: 'types',
      format: 'es',
    },
    plugins: [
      dts(),
      license({
        banner: {
          content: {
            file: path.join(process.cwd(), 'LICENSE'),
          },
        },
      }),
    ],
  },
] as RollupOptions;
