import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";



export function SliderDemo({ className, ...props }) {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn("w-[60%]", className)}
      {...props}
    />
  );
}
