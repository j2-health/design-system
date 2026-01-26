import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        j2: {
          // Primary color tokens
          primary: 'var(--j2-color-primary)',
          'primary-hover': 'var(--j2-color-primary-hover)',
          'primary-active': 'var(--j2-color-primary-active)',
          'primary-bg': 'var(--j2-color-primary-bg)',
          'primary-bg-hover': 'var(--j2-color-primary-bg-hover)',
          'primary-border': 'var(--j2-color-primary-border)',
          'primary-border-hover': 'var(--j2-color-primary-border-hover)',
          'primary-text': 'var(--j2-color-primary-text)',
          'primary-text-hover': 'var(--j2-color-primary-text-hover)',
          'primary-text-active': 'var(--j2-color-primary-text-active)',

          // Text color tokens
          text: 'var(--j2-color-text)',
          'text-secondary': 'var(--j2-color-text-secondary)',
          'text-tertiary': 'var(--j2-color-text-tertiary)',
          'text-quaternary': 'var(--j2-color-text-quaternary)',
          'text-heading': 'var(--j2-color-text-heading)',
          'text-label': 'var(--j2-color-text-label)',
          'text-description': 'var(--j2-color-text-description)',
          'text-disabled': 'var(--j2-color-text-disabled)',
          'text-placeholder': 'var(--j2-color-text-placeholder)',

          // Border color tokens
          border: 'var(--j2-color-border)',
          'border-secondary': 'var(--j2-color-border-secondary)',

          // Background color tokens
          'bg-layout': 'var(--j2-color-bg-layout)',
          'bg-elevated': 'var(--j2-color-bg-elevated)',
          'bg-mask': 'var(--j2-color-bg-mask)',
          'bg-spotlight': 'var(--j2-color-bg-spotlight)',

          // Status colors
          success: 'var(--j2-color-success)',
          'success-bg': 'var(--j2-color-success-bg)',
          'success-bg-hover': 'var(--j2-color-success-bg-hover)',
          'success-border': 'var(--j2-color-success-border)',
          warning: 'var(--j2-color-warning)',
          'warning-bg': 'var(--j2-color-warning-bg)',
          'warning-bg-hover': 'var(--j2-color-warning-bg-hover)',
          'warning-border': 'var(--j2-color-warning-border)',
          error: 'var(--j2-color-error)',
          'error-bg': 'var(--j2-color-error-bg)',
          'error-bg-hover': 'var(--j2-color-error-bg-hover)',
          'error-border': 'var(--j2-color-error-border)',
          info: 'var(--j2-color-info)',
          'info-bg': 'var(--j2-color-info-bg)',
          'info-bg-hover': 'var(--j2-color-info-bg-hover)',
          'info-border': 'var(--j2-color-info-border)',

          // Icon colors
          icon: 'var(--j2-color-icon)',
          'icon-hover': 'var(--j2-color-icon-hover)',
        },
      },
      borderWidth: {
        j2: 'var(--j2-line-width)',
        'j2-bold': 'var(--j2-line-width-bold)',
        'j2-focus': 'var(--j2-line-width-focus)',
      },
      borderRadius: {
        j2: 'var(--j2-border-radius)',
        'j2-lg': 'var(--j2-border-radius-lg)',
        'j2-sm': 'var(--j2-border-radius-sm)',
        'j2-xs': 'var(--j2-border-radius-xs)',
      },
      spacing: {
        j2: 'var(--j2-size)',
        'j2-xs': 'var(--j2-size-xs)',
        'j2-sm': 'var(--j2-size-sm)',
        'j2-md': 'var(--j2-size-md)',
        'j2-lg': 'var(--j2-size-lg)',
        'j2-xl': 'var(--j2-size-xl)',
        'j2-xxl': 'var(--j2-size-xxl)',
      },
    },
  },
  plugins: [],
} satisfies Config
