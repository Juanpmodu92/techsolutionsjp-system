import { Link } from 'react-router';

export default function QuickAccessCard({ to, title, description }) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </Link>
  );
}