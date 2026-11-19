import Link from 'next/link'

interface Props {
  title: string
  href?: string
  as?: 'h1' | 'h2'
  children?: React.ReactNode
}

export default function SectionTitle({ title, href, as: Tag = 'h2', children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Tag className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink sm:text-xl">
        <span className="h-5 w-1 rounded-full bg-gold" aria-hidden />
        {title}
      </Tag>
      {children}
      {href && (
        <Link href={href} className="text-sm text-muted transition hover:text-gold">
          Voir tout →
        </Link>
      )}
    </div>
  )
}
