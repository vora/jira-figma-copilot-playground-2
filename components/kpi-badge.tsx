interface KpiBadgeProps {
  number: string
  label: string
}

export function KpiBadge({ number, label }: KpiBadgeProps) {
  return (
    <div className="bg-blue-700/50 rounded-xl p-4 border border-blue-600 flex-1">
      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-2">
        {number}
      </div>
      <p className="text-sm text-blue-100 leading-tight">{label}</p>
    </div>
  )
}
