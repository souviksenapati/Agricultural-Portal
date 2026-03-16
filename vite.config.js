import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://144.76.19.201:3002',
                changeOrigin: true,
                // No rewrite — backend expects the /api prefix in the URL
            },
            '/oauth': {
                target: 'http://144.76.19.201:3002',
                changeOrigin: true,
                // OAuth token endpoint lives at root (no /api prefix)
            },
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
            },
            manifest: {
                name: 'Bhumihin Khetmajur Portal',
                short_name: 'Khetmajur',
                description: 'Financial Assistance Scheme for Agricultural Labourers in West Bengal',
                theme_color: '#0648b3',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/image/logo_bsb.png', // Using existing logo as a fallback icon
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/image/logo_bsb.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
})