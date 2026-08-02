interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentTabsProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function SegmentTabs<T extends string>({ options, value, onChange }: SegmentTabsProps<T>) {
  return (
    <div className="segment">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentTabs;
