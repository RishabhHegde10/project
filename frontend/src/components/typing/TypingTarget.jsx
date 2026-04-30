export default function TypingTarget({ target, typed, showCaret = true }) {
  const caretIndex = typed.length;

  return (
    <div className="mt-6 rounded-3xl border border-white/70 bg-white/35 backdrop-blur-xl p-5">
      <div className="flex flex-wrap gap-0.5 text-base leading-relaxed md:text-lg">
        {target.split("").map((ch, i) => {
          const isTyped = i < typed.length;
          const typedChar = typed[i];
          const isCorrect = isTyped && typedChar === ch;
          const isWrong = isTyped && !isCorrect;
          const isCaret = showCaret && i === caretIndex;

          return (
            <span
              key={i}
              className={[
                "relative select-none",
                !isTyped ? "text-slate-400" : isCorrect ? "text-slate-900" : "text-rose-600",
              ].join(" ")}
            >
              {ch}
              {isWrong ? (
                <span className="absolute -inset-1 -z-10 rounded-md bg-rose-100/70 blur-[0.2px]" />
              ) : null}
              {isCaret ? (
                <span className="absolute -bottom-1 left-0 h-5 w-[2px] rounded-full bg-violet-600 animate-pulse" />
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

