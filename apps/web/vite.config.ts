import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      nitroV2Plugin({
        runtimeConfig: {
          databaseUrl: env.DATABASE_URL,
          betterAuthSecret: env.BETTER_AUTH_SECRET,
          betterAuthUrl: env.BETTER_AUTH_URL,
        },
      }),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    define: {
      'process.env.BETTER_AUTH_URL': JSON.stringify(env.BETTER_AUTH_URL),
    },
  }
})

export default config
