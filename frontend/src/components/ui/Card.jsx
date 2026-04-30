export default function Card({ children, className = "", ...props }) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/70 bg-white/50 backdrop-blur-xl shadow-soft",
        "p-5 md:p-6",
        "transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/60",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}

