import Image from 'next/image'
import { CalendarClock } from 'lucide-react'

export default function ComingSoon({ backdrop, date }: { backdrop: string | null; date?: string }) {
  const label = date
    ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {backdrop && <Image src={backdrop} alt="" fill sizes="100vw" className="object-cover opacity-30" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CalendarClock size={26} />
        </span>
        <p className="text-xl font-semibold text-white sm:text-2xl">Bientôt disponible</p>
        <p className="text-sm text-muted">{label ? `Sortie prévue le ${label}` : 'Date de sortie non annoncée'}</p>
      </div>
    </div>
  )
}
