export default function AdminCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: string;
  color: string;
}) {
  return (
    <div className="admin-card" style={{ borderLeftColor: color }}>
      <div className="card-content">
        <div className="card-value" style={{ color }}>{value}</div>
        <div className="card-title">{title}</div>
      </div>
      <div className="card-icon" style={{ backgroundColor: color + '20' }}>
        {icon}
      </div>
    </div>
  );
}
