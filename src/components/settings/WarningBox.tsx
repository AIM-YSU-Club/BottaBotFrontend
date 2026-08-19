interface WarningBoxProps {
  title: string;
  items: string[];
  note?: string;
}

const WarningBox = ({ title, items, note }: WarningBoxProps) => {
  return (
    <div className="warning-box">
      <div className="wtitle">{title}</div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {note && <div className="wnote">{note}</div>}
    </div>
  );
};

export default WarningBox;
