import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// Liquid Glass Badge Component
function GlassFilter({ filterId }: { filterId: string }) {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur
            in="displaced"
            stdDeviation="4"
            result="finalBlur"
          />
          <feComposite
            in="finalBlur"
            in2="finalBlur"
            operator="over"
          />
        </filter>
      </defs>
    </svg>
  );
}

const liquidGlassBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary-foreground backdrop-blur-[2px] [a&]:hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary-foreground backdrop-blur-[2px] [a&]:hover:bg-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-white backdrop-blur-[2px] [a&]:hover:bg-destructive/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20",
        outline:
          "text-foreground backdrop-blur-[2px] [a&]:hover:bg-accent/20 [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function LiquidGlassBadge({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof liquidGlassBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  const filterId = React.useId()

  return (
    <>
      <Comp
        data-slot="liquid-glass-badge"
        className={cn(liquidGlassBadgeVariants({ variant }), className)}
        {...props}
      >
        {/* Glass effect overlay */}
        <div
          className="absolute inset-0 z-0 h-full w-full rounded-md 
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
          transition-all 
          pointer-events-none
          dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
        />

        {/* Glass filter effect */}
        <div
          className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-md"
          style={{ backdropFilter: `url("#${filterId}")` }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Shine effect */}
        <div className="absolute inset-0 z-20 rounded-md bg-gradient-to-r from-transparent dark:via-white/5 via-black/5 to-transparent opacity-0 transition-opacity duration-200 hover:opacity-100 pointer-events-none" />

        <GlassFilter filterId={filterId} />
      </Comp>
    </>
  )
}

export { Badge, badgeVariants, LiquidGlassBadge }
