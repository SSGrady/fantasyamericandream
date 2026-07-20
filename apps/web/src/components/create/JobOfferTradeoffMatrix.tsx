'use client';

import type { JobOffer } from '@fad/domain';
import { deferralRateFromOffer } from '@fad/domain';
import { formatMoney } from '../../lib/format-money';

interface JobOfferTradeoffMatrixProps {
  offers: JobOffer[];
  selectedOfferId: string | null;
  onSelect: (offerId: string) => void;
}

export function JobOfferTradeoffMatrix({
  offers,
  selectedOfferId,
  onSelect,
}: JobOfferTradeoffMatrixProps) {
  const rows = [
    { key: 'salary', label: 'Base salary', render: (o: JobOffer) => formatMoney(o.baseSalaryAnnual) },
    {
      key: 'commute',
      label: 'Commute',
      render: (o: JobOffer) => (o.commuteMinutes === 0 ? 'Remote' : `${o.commuteMinutes} min`),
    },
    { key: 'remote', label: 'Remote days', render: (o: JobOffer) => `${o.remoteDaysPerWeek}/wk` },
    {
      key: 'deferral',
      label: '401(k) deferral hint',
      render: (o: JobOffer) => `${Math.round(deferralRateFromOffer(o) * 100)}%`,
    },
    { key: 'risk', label: 'Risk tag', render: (o: JobOffer) => o.riskTag },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-3 py-2 text-left font-medium text-muted">Dimension</th>
            {offers.map((offer) => (
              <th key={offer.id} className="px-3 py-2 text-left font-medium text-ink">
                <button
                  type="button"
                  onClick={() => onSelect(offer.id)}
                  className={`text-left ${selectedOfferId === offer.id ? 'text-accent' : ''}`}
                >
                  {offer.employer}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-muted">{row.label}</td>
              {offers.map((offer) => (
                <td
                  key={`${row.key}-${offer.id}`}
                  className={`px-3 py-2 text-ink ${selectedOfferId === offer.id ? 'bg-accent/5' : ''}`}
                >
                  {row.render(offer)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
