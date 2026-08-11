interface WarningBoxProps {
  title: string;
  items: string[];
  note?: string;
}

const WarningBox = ({ title, items, note }: WarningBoxProps) => {
  return (
    <>
      <div className="warning-box">
        <div className="wtitle">{title}</div>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <span className="x">✕</span> {item}
            </li>
          ))}
        </ul>
      </div>
      {note && <div className="note-center">{note}</div>}
    </>
  );
};

export default WarningBox;
