import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

import path from "path";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

export default fs
  .readdirSync(path.join(__dirname, "webviews", "pages"))
  .map((input) => {
    const name = input.split(".")[0];
    return {
      input: "webviews/pages/" + input,
      output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: "out/webviews/" + name + ".js"
      },
      plugins: [
        svelte({
          preprocess: sveltePreprocess({ sourceMap: !production }),
          compilerOptions: {
            // enable run-time checks when not in production
            dev: !production
          }
        }),

        css({ output: name + ".css" }),


        resolve({
          browser: true,
          dedupe: ['svelte']
        }),
        commonjs(),
        typescript({
          tsconfig: "webviews/tsconfig.json",
          sourceMap: !production,
          inlineSources: !production
        }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
      ],
      watch: {
        clearScreen: false
      }
    };
  });
