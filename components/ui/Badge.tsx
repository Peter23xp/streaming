import { cn } from '@/lib/utils'

interface BadgeProps {
  variant: 'vf' | 'vostfr' | 'hd' | 'cam'
  className?: string
}

const styles: Record<BadgeProps['variant'], string> = {
  vf: 'bg-blue-600 text-white',
  vostfr: 'bg-purple-600 text-white',
  hd: 'bg-zinc-700 text-zinc-200',
  cam: 'bg-yellow-600 text-black',
}

const labels: Record<BadgeProps['variant'], string> = {
  vf: 'VF',
  vostfr: 'VOSTFR',
  hd: 'HD',
  cam: 'CAM',
}

export default function Badge({ variant, className }: BadgeProps) {
  return (
    <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded', styles[variant], className)}>
      {labels[variant]}
    </span>
  )
}
