interface SiteFooterProps {
  line: string;
  githubUrl: string;
  disclaimer: string;
}

export function SiteFooter({ line, githubUrl, disclaimer }: SiteFooterProps) {
  return (
    <footer className="mt-24 border-t border-zinc-200 py-12">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-lg space-y-3">
          <p className="text-[13px] leading-relaxed text-zinc-700">{line}</p>
          <p className="text-[11px] leading-relaxed text-zinc-500">{disclaimer}</p>
        </div>
        <a
          href={githubUrl}
          className="shrink-0 text-[13px] text-zinc-600 hover:text-zinc-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </div>
    </footer>
  );
}
