import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true
        }
      }
    },
    projects: [
      {
        test: {
          globals: true,
          name: 'unit',
          include: ['tests/{e2e,unit}/**/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          globals: true,
          name: 'nuxt',
          include: ['tests/nuxt/**/*.{test,spec}.ts', 'app/components/**/*.{test,spec}.ts'],
          environment: 'nuxt'
        }
      })
    ]
  }
});
