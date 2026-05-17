import { cn, getInitials, generateColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  const color = generateColor(name);
  return (
    <div className={cn(`${sizeClass} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white flex-shrink-0`, className)}>
      {getInitials(name)}
    </div>
  );
}
