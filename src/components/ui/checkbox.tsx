import * as React from "react"
import { Check } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "../../lib/utils"

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  isDarkMode?: boolean
  size?: "sm" | "md"
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, isDarkMode, size = "md", ...props }, ref) => {
  const sizeClasses =
    size === "sm" ? "h-4 w-4 text-[10px]" : "h-5 w-5 text-xs"

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer shrink-0 rounded border transition-colors",
          sizeClasses,
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isDarkMode
            ? "border-zinc-500 bg-zinc-600 text-white"
            : "border-gray-300 bg-white text-black",
          "data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-600",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
          <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <span className={cn("text-sm", isDarkMode ? "text-gray-200" : "text-[#656565]")}>
          {label}
        </span>
      )}
    </label>
  )
})
Checkbox.displayName = "Checkbox"
