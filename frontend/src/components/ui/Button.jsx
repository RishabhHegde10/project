export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200/70 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-soft hover:translate-y-[-1px] hover:shadow-[0_12px_34px_rgba(147,51,234,0.25)]",
    secondary:
      "bg-white/60 text-violet-700 border border-violet-200/80 hover:bg-white/80 hover:translate-y-[-1px]",
    ghost:
      "bg-transparent text-violet-700 hover:bg-violet-50/70 hover:translate-y-[-1px]",
    danger:
      "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-soft hover:translate-y-[-1px]",
  };

  return (
    <button className={`${base} ${variants[variant] ?? variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

