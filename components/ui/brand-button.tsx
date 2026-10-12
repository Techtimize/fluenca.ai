import Link from "next/link";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

type BrandVariants = VariantProps<typeof buttonVariants>;

type BrandButtonShared = {
  className?: string;
  children?: React.ReactNode;
  variant?: Extract<BrandVariants["variant"], "default" | "outline"> | "brand";
  size?: BrandVariants["size"];
};

type BrandButtonAsButton = BrandButtonShared &
  Omit<ButtonPrimitive.Props, "className" | "children"> & {
    href?: undefined;
  };

type BrandButtonAsLink = BrandButtonShared &
  Omit<React.ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
    disabled?: boolean;
  };

export type BrandButtonProps = BrandButtonAsButton | BrandButtonAsLink;

function resolveVariant(
  variant: BrandButtonShared["variant"],
): NonNullable<BrandVariants["variant"]> {
  if (variant === "outline") return "outline";
  return "default";
}

/** Primary Fluenca CTA — same design as navbar Sign up. Alias of Button brand styles + Link support. */
function BrandButton({
  className,
  variant = "brand",
  size = "default",
  children,
  ...props
}: BrandButtonProps) {
  const classes = cn(
    buttonVariants({ variant: resolveVariant(variant), size }),
    className,
  );

  if ("href" in props && props.href) {
    const { href, disabled, ...linkProps } = props as BrandButtonAsLink;
    if (disabled) {
      return (
        <span
          aria-disabled
          className={cn(classes, "pointer-events-none opacity-60")}
        >
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as BrandButtonAsButton;
  return (
    <ButtonPrimitive
      data-slot="brand-button"
      className={classes}
      {...buttonProps}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { BrandButton, buttonVariants as brandButtonVariants };
