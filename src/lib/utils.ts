import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The iOS text styles in index.css (text-body, text-footnote, …) are font
// sizes; without this tailwind-merge reads them as text colors and drops
// text-primary and friends when both are on one element
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'large-title',
        'headline',
        'body',
        'callout',
        'subheadline',
        'footnote',
        'caption1',
        'caption2',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
