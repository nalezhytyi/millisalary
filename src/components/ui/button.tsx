import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// iOS 27 buttons (kit 27.0.2): every style is a pill (or a circle for icons).
// Pressed dims to 70% like UIKit's highlighted state, disabled shows at 30%.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-opacity duration-100 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:opacity-70 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Bordered Prominent: accent fill. Disabled it turns into the kit's
        // inactive pill (8% fill, 0.5pt rim, grey glyph), not a faded blue
        prominent:
          "bg-primary text-primary-foreground disabled:bg-fill-quaternary disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-[0_0_0_0.5px_var(--glass-rim)]",
        // Bordered: grey fill with accent text
        bordered: "bg-fill-quaternary text-primary active:bg-fill-tertiary",
        plain: "text-primary",
        // Bordered with the destructive color, for a discard choice
        destructive:
          "bg-fill-quaternary text-destructive active:bg-fill-tertiary",
        // Floating controls over content; see the glass utility in index.css
        glass: "glass text-primary",
      },
      size: {
        small:
          "h-7 gap-1 px-3 text-footnote [&_svg:not([class*='size-'])]:size-3.5",
        medium:
          "h-[34px] gap-1.5 px-4 text-subheadline [&_svg:not([class*='size-'])]:size-4",
        large:
          "h-[50px] gap-2 px-6 text-body [&_svg:not([class*='size-'])]:size-5",
        // 44pt bar button item
        icon: "size-11 [&_svg:not([class*='size-'])]:size-5",
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
