import { ASSISTANT_PROMPTS } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { SparkIcon } from './Icons';

export default function AssistantSection({ onOpenChat }) {
  return (
    <section id="assistant" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="AI assistant" title="Meet my AI assistant">
            Curious about my projects, technical experience or the systems I’ve built? Ask the assistant — it answers
            questions about my work so you don’t have to dig.
          </SectionHeading>
        </div>

        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-2xl border border-line/12 bg-surface/70 p-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)] sm:p-7">
            <div className="hero-glow pointer-events-none absolute -right-24 -top-24 h-64 w-64" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-ink">
                  <SparkIcon width={14} height={14} />
                </span>
                <p className="font-semibold tracking-tight">Ask Pourush’s AI</p>
              </div>

              <ul className="mt-6 space-y-2.5">
                {ASSISTANT_PROMPTS.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => onOpenChat(q)}
                      className="w-full rounded-xl border border-line/12 bg-bg/60 px-4 py-3 text-left text-[14.5px] text-fg/90 transition hover:border-accent/50 hover:text-accent"
                    >
                      “{q}”
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onOpenChat()}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition hover:brightness-110"
              >
                Start Conversation <SparkIcon width={14} height={14} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
