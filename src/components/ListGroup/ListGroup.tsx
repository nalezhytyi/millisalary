import { ReactNode } from 'react'

interface ListGroupProps {
  title: string
  footer?: string
  children: ReactNode
}

// Grouped list section: sentence-case header, rounded card of rows, footer
// note (iOS 27: 17pt semibold header, 26pt card corners)
const ListGroup = ({ title, footer, children }: ListGroupProps) => (
  <section className="mb-6">
    <h3 className="px-4 py-2.5 text-headline font-semibold text-muted-foreground">
      {title}
    </h3>
    <div className="overflow-hidden rounded-card bg-card">{children}</div>
    {footer && (
      <p className="px-4 pt-2 pb-1.5 text-footnote text-muted-foreground">
        {footer}
      </p>
    )}
  </section>
)

export default ListGroup
