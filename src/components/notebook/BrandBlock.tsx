import Mascot from '../common/Mascot';

interface BrandBlockProps {
  name: string;
  status: string;
}

const BrandBlock = ({ name, status }: BrandBlockProps) => {
  return (
    <div className="brand">
      <Mascot size="sm" />
      <div className="brand-text">
        <h1 className="name">{name}</h1>
        <span className="status">
          <span className="dot"></span>
          {status}
        </span>
      </div>
    </div>
  );
};

export default BrandBlock;
