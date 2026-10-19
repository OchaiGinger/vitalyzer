export default function Eyebrow({
  children,
  blink = false,
  className = "",
}: {
  children: React.ReactNode;
  blink?: boolean;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-2 text-sm tracking-wide text-muted-foreground ${className}`}>
      <span
        aria-hidden="true"
        className={`size-[5px] bg-primary ${blink ? "animate-[blink_1.4s_ease-in-out_infinite] motion-reduce:animate-none" : ""}`}
      />
      {children}
    </p>
  );
}