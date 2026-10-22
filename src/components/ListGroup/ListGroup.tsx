import { ReactNode } from 'react'

interface ListGroupProps {
  title: string
  footer?: string
  children: ReactNode
}

// Grouped list section: small caps header, rounded card of rows, footer note
const ListGroup = ({ title, footer, children }: ListGroupProps) => (
  <section className="mb-6">
    <h3 className="mb-1.5 px-4 text-[13px] tracking-[0.04em] text-muted-foreground uppercase">
      {title}
    </h3>
    <div className="overflow-hidden rounded-xl bg-card">{children}</div>
    {footer && (
      <p className="mt-1.5 px-4 text-[13px] leading-snug text-muted-foreground">
        {footer}
      </p>
    )}
  </section>
)

export default ListGroup
