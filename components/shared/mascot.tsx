import Image from "next/image";

type Props = {
  // Path under /public, e.g. "/mascots/n_mascot_3.gif".
  src: string;
  size?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
};

// Animated mascot GIF. Each page passes the GIF it wants to show.
export default function Mascot({ src, size = 96, alt = "AI mascot", className = "", priority = false }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      // GIFs must skip optimization, otherwise they lose their animation.
      unoptimized
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
