interface HourBlockProps {
  hour: number;
  onClick: (hour: number) => void;
}

export const HourBlock: React.FC<HourBlockProps> = ({ hour, onClick }) => (
  <div
    className="h-20 border-b text-sm text-center text-gray-500 cursor-pointer"
    onClick={() => onClick(hour)}
  ></div>
);
