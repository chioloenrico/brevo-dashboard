"use client"

function formatPercentage(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value)
}

function getCampaignMetrics(campaign) {
  if (campaign.status !== 'sent' || !campaign.stats) {
    return { deliveryRate: null, openRate: null, clickRate: null }
  }
  const { sent = 0, delivered = 0, opened = 0, clicked = 0 } = campaign.stats
  const deliveryRate = sent > 0 ? delivered / sent : null
  const openRate = delivered > 0 ? opened / delivered : null
  const clickRate = delivered > 0 ? clicked / delivered : null
  return { deliveryRate, openRate, clickRate }
}

function StatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : ''
  const colorClasses =
    status === 'sent'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
      : status === 'draft'
        ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'

  return (
    <span
      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${colorClasses}`}
    >
      {label}
    </span>
  )
}

export default function CampaignList({ campaigns }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-foreground/10 border border-foreground/10 rounded-lg">
        <thead className="bg-foreground/5">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Delivery Rate
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Open Rate
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Click Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-foreground/10">
          {campaigns.map((campaign, index) => {
            const metrics = getCampaignMetrics(campaign)
            const isEven = index % 2 === 0

            return (
              <tr
                key={campaign.id}
                className={`hover:bg-foreground/5 ${
                  isEven ? 'bg-background' : 'bg-foreground/2'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-left">
                  {campaign.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right">
                  {metrics.deliveryRate !== null
                    ? formatPercentage(metrics.deliveryRate)
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right">
                  {metrics.openRate !== null
                    ? formatPercentage(metrics.openRate)
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right">
                  {metrics.clickRate !== null
                    ? formatPercentage(metrics.clickRate)
                    : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
