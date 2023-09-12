import { compile } from 'ejs';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es']
    }
  },

  plugins: [
    {
      name: 'ejs',
      async transform(_, id) {
        if (id.endsWith('.ejs')) {
          const src = await readFile(id, 'utf-8');
          const code = compile(src, {
            client: true,
            strict: true,
            filename: relative(__dirname, id)
          }).toString();
          return `export default ${code}`;
        }
      }
    }
  ]
});
