interface HourBlockProps {
  onMouseDown: (quarter: number) => void
  onMouseEnter: (quarter: number) => void
  isHighlighted: number[]
}

export const HourBlock: React.FC<HourBlockProps> = ({ onMouseDown, onMouseEnter, isHighlighted }) => (
  <div className="h-[80px] border-b-[1px] text-sm text-center text-gray-500 cursor-pointer flex flex-col">
    {Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`flex-1 border-t-[1px] border-dashed ${isHighlighted.includes(i) ? 'bg-blue-100' : ''}`}
        onMouseDown={() => onMouseDown(i)}
        onMouseEnter={() => onMouseEnter(i)}
      ></div>
    ))}
  </div>
)
