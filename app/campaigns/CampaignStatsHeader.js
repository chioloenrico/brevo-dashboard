"use client"

function formatPercentage(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value)
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-medium text-foreground/70">{label}</h3>
      </div>
      <div className="text-3xl font-light text-foreground">
        {formatPercentage(value)}
      </div>
    </div>
  )
}

export default function CampaignStatsHeader({ metrics }) {
  const { deliveryRate = 0, openRate = 0, clickRate = 0 } = metrics || {}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <MetricCard 
        icon="📧" 
        label="Delivery Rate" 
        value={deliveryRate} 
      />
      <MetricCard 
        icon="👁️" 
        label="Open Rate" 
        value={openRate} 
      />
      <MetricCard 
        icon="🖱️" 
        label="Click Rate" 
        value={clickRate} 
      />
    </div>
  )
}
