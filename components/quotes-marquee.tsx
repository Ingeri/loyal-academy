"use client";

interface QuoteItem {
  id: string;
  content: string;
  authorName: string;
  authorRole: string | null;
}

export function QuotesMarquee({ quotes }: { quotes: QuoteItem[] }) {
  if (quotes.length === 0) return null;

  // Duplicate the list so the loop is seamless
  const track = [...quotes, ...quotes];

  return (
    <div className="quotes-marquee-viewport">
      <style>{`
        .quotes-marquee-viewport {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .quotes-marquee-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: quotes-marquee-scroll ${quotes.length * 8}s linear infinite;
        }

        .quotes-marquee-viewport:hover .quotes-marquee-track {
          animation-play-state: paused;
        }

        @keyframes quotes-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="quotes-marquee-track">
        {track.map((quote, index) => (
          <div
            key={`${quote.id}-${index}`}
            className="flex w-[320px] shrink-0 flex-col rounded-3xl bg-[#faf8f3] p-8 shadow-lg"
          >
            <svg
              className="mb-5 h-8 w-8 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z" />
            </svg>
            <p className="flex-1 italic leading-7 text-slate-700">
              &ldquo;{quote.content}&rdquo;
            </p>
            <div className="mt-6 border-t border-muted pt-4">
              <p className="font-serif font-bold text-primary">
                {quote.authorName}
              </p>
              {quote.authorRole && (
                <p className="text-sm text-accent">{quote.authorRole}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}