import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// iOS 27 buttons (kit 27.0.2): every style is a pill (or a circle for icons)
// with a Medium label like the kit's Liquid Glass buttons. Pressed, it swells
// and brightens like an iOS 27 glass button under a finger, over 450 ms on the
// CSS ease curve, and eases back over 600 ms with no bounce (under reduced
// motion it quickly dims to 70% instead); disabled shows at 30%. Round icon buttons swell the most: a native 44pt bar button grows to
// 60pt, glyph included (1.36, measured on the iOS 27 simulator).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-[scale,filter,opacity] duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[var(--press-scale,1.08)] active:brightness-110 active:duration-450 motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:active:duration-100 motion-reduce:active:scale-100 motion-reduce:active:brightness-100 motion-reduce:active:opacity-70 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Glass Prominent: accent fill with the kit's lit top and bottom rims
        // (the side shadows in the kit sit under its backing). Disabled
        // it turns into a plain glass pill with a grey glyph (kit inactive
        // state), not a faded blue
        prominent:
          "bg-[var(--glass-prominent-fill)] text-primary-foreground shadow-[var(--glass-prominent-shadow)] disabled:glass disabled:text-[var(--glass-label-disabled)] disabled:opacity-100",
        // Bordered (kit Button - Content Area): grey fill with accent text
        bordered: "bg-fill-tertiary text-primary active:bg-fill-secondary",
        // Borderless text dims like UIKit's highlighted state instead
        plain:
          "text-primary active:scale-100 active:brightness-100 active:opacity-70",
        // Glass with the destructive color (kit Glass, Destructive=True)
        destructive: "glass text-destructive",
        // Floating controls over content; see the glass utility in index.css
        // Glyphs in the label color like iOS 27 bar buttons (kit Default state)
        glass: "glass text-[var(--glass-label)]",
      },
      size: {
        small:
          "h-7 gap-1 px-3 text-footnote [&_svg:not([class*='size-'])]:size-3.5",
        medium:
          "h-[34px] gap-1.5 px-4 text-subheadline [&_svg:not([class*='size-'])]:size-4",
        large:
          "h-[50px] gap-2 px-5 text-body [&_svg:not([class*='size-'])]:size-5",
        // 44pt bar button item
        icon: "size-11 [--press-scale:1.36] [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "prominent",
      size: "medium",
    },
  }
)

function Button({
  className,
  variant = "prominent",
  size = "medium",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
