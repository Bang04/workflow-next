import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-[15px]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="text-zinc-400 hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "font-medium text-zinc-900" : "text-zinc-400"}
                >
                  {item.label}
                </span>
              )}
              {!last && <span className="text-zinc-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
