interface SiteFooterProps {
  line: string;
  githubUrl: string;
  disclaimer: string;
}

export function SiteFooter({ line, githubUrl, disclaimer }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-sm text-zinc-700">{line}</p>
          <p className="text-xs leading-relaxed text-zinc-500">{disclaimer}</p>
        </div>
        <a
          href={githubUrl}
          className="text-sm font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>
      </div>
    </footer>
  );
}
