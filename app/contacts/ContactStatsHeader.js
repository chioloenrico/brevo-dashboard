"use client"

function formatCount(value) {
  return new Intl.NumberFormat('it-IT').format(value)
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-medium text-foreground/70">{label}</h3>
      </div>
      <div className="text-3xl font-light text-foreground">
        {formatCount(value)}
      </div>
    </div>
  )
}

function calculateContactMetrics(contacts) {
  if (!Array.isArray(contacts)) {
    return {
      totalContacts: 0,
      blacklistedContacts: 0
    }
  }

  const totalContacts = contacts.length
  const blacklistedContacts = contacts.filter(
    contact => contact.emailBlacklisted === true
  ).length

  return {
    totalContacts,
    blacklistedContacts
  }
}

export default function ContactStatsHeader({ contacts }) {
  const metrics = calculateContactMetrics(contacts)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        icon="👥"
        label="Totale Contatti"
        value={metrics.totalContacts}
      />
      <MetricCard
        icon="🚫"
        label="Blacklisted"
        value={metrics.blacklistedContacts}
      />
    </div>
  )
}

export { calculateContactMetrics }
