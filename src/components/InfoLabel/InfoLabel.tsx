interface InfoLabelProps {
  label: string
  info: string
  className?: string
}

const InfoLabel: React.FC<InfoLabelProps> = ({ label, info, className }) => {
  return (
    <div className={className}>
      <div className="group relative inline-flex items-center">
        <label className="block cursor-help text-gray-300">{label}</label>
        <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-56 rounded-md border border-gray-200/15 bg-slate-950/95 px-3 py-2 text-xs leading-relaxed text-gray-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
          {info}
        </div>
      </div>
    </div>
  )
}

export default InfoLabel
