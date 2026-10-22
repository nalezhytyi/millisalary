import { ReactNode } from 'react'

interface ListRowProps {
  label: string
  htmlFor?: string
  children: ReactNode
}

// Label on the left, control on the right, inset hairline between rows
const ListRow = ({ label, htmlFor, children }: ListRowProps) => (
  <div className="relative flex min-h-11 items-center justify-between gap-4 px-4 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-px after:bg-border last:after:hidden">
    <label htmlFor={htmlFor} className="text-[17px]">
      {label}
    </label>
    {children}
  </div>
)

export default ListRow
