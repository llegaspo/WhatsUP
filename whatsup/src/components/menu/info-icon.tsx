'use client';

import Link from 'next/link';

export default function InfoIcon({
  tooltip,
  href = 'https://facebook.com/your-page-name'
}: {
  tooltip?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      href="/fb-pages"
      rel="noopener noreferrer"
      title={tooltip || 'Info'}
      className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold hover:bg-blue-600"
    >
      i
    </Link>
  );
}
