import { useCallback, useEffect, useRef, useState } from 'react';
import { ASSISTANT_PROMPTS } from '../data/content';
import { askAssistant } from '../lib/assistant';
import { CloseIcon, SendIcon, SparkIcon } from './Icons';

const GREETING = {
  role: 'assistant',
  text: 'Hi! I’m Pourush’s portfolio assistant. Ask me about his projects, technologies or experience.',
};

export default function ChatDrawer({ open, prompt, nonce, onClose }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const send = useCallback(async (q) => {
    const text = q.trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setBusy(true);
    try {
      const answer = await askAssistant(text);

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: answer,
        },
      ]);
    } catch (error) {
      console.error('Assistant API error:', error);

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'Sorry, I could not connect to the AI assistant right now.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, [busy]);

  // A suggested prompt clicked elsewhere on the page is sent automatically.
  useEffect(() => {
    if (open && prompt) send(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [open, onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-label="AI assistant"
        aria-hidden={!open}
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-line/12 bg-bg shadow-2xl"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(105%)',
          visibility: open ? 'visible' : 'hidden',
          transition: `transform .4s cubic-bezier(.2,.7,.2,1), visibility 0s linear ${open ? '0s' : '.4s'}`,
        }}
      >
        <header className="flex items-center justify-between border-b border-line/12 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-ink">
              <SparkIcon width={14} height={14} />
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-semibold">Ask Pourush’s AI</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Demo mode</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close assistant" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-fg/10 hover:text-fg">
            <CloseIcon width={16} height={16} />
          </button>
        </header>

        <div className="chat-scroll flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                  m.role === 'user' ? 'rounded-br-md bg-accent text-accent-ink' : 'rounded-bl-md border border-line/12 bg-surface text-fg'
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <p className="typing rounded-2xl rounded-bl-md border border-line/12 bg-surface px-4 py-3" aria-label="Assistant is typing">
                <span /><span /><span />
              </p>
            </div>
          )}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {ASSISTANT_PROMPTS.map((q) => (
                <button key={q} type="button" onClick={() => send(q)} className="rounded-full border border-line/15 px-3 py-1.5 text-[12.5px] text-muted transition hover:border-accent/60 hover:text-accent">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-line/12 p-4"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about projects, stack, experience…"
            className="min-w-0 flex-1 rounded-full border border-line/15 bg-surface px-4 py-2.5 text-[14px] outline-none placeholder:text-muted/70 focus:border-accent/60"
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition enabled:hover:brightness-110 disabled:opacity-40">
            <SendIcon width={16} height={16} />
          </button>
        </form>
      </aside>
    </>
  );
}
