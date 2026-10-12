import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center border border-transparent bg-clip-padding font-body text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-brand text-white shadow-[0_3px_0_#bfc1ff] hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        outline:
          "rounded-full border-black/10 bg-white text-ink hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "rounded-full hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "rounded-none text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-10 gap-1.5 px-4 sm:h-11 sm:px-6 lg:px-7",
        xs: "h-7 gap-1 px-3 text-xs",
        sm: "h-9 gap-1 px-4 sm:h-10 sm:px-5",
        lg: "h-11 gap-1.5 px-6 sm:h-12",
        full: "h-10 w-full gap-1.5 px-4",
        icon: "size-10 rounded-full shadow-[0_3px_0_#bfc1ff] p-0",
        "icon-xs": "size-6 rounded-full p-0 shadow-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full p-0 shadow-none",
        "icon-lg": "size-11 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
