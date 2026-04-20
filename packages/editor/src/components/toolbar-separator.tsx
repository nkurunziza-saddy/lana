import { cn } from "@lana/utils";

interface Props {
  orientation?: "vertical" | "horizontal";
}
const Separator = ({ orientation = "vertical" }: Props) => {
  return (
    <div
      className={cn(
        "bg-linear-to-b from-transparent via-border to-transparent",
        orientation === "horizontal" ? "h-px w-6 my-1.5" : "w-px h-5 mx-1 shrink-0",
      )}
    />
  );
};

export { Separator };
