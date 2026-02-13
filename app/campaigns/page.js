import CampaignList from './CampaignList'
import CampaignStatsHeader from './CampaignStatsHeader'

function calculateAggregateMetrics(campaigns) {
  // Filtra solo campagne inviate con statistiche disponibili
  const sentCampaigns = campaigns.filter(
    campaign => campaign.status === 'sent' && campaign.stats
  )

  if (sentCampaigns.length === 0) {
    return {
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0
    }
  }

  // Calcola totali
  let totalSent = 0
  let totalDelivered = 0
  let totalOpened = 0
  let totalClicked = 0

  sentCampaigns.forEach(campaign => {
    const { sent, delivered, opened, clicked } = campaign.stats
    totalSent += sent || 0
    totalDelivered += delivered || 0
    totalOpened += opened || 0
    totalClicked += clicked || 0
  })

  // Calcola percentuali
  const deliveryRate = totalSent > 0 ? totalDelivered / totalSent : 0
  const openRate = totalDelivered > 0 ? totalOpened / totalDelivered : 0
  const clickRate = totalDelivered > 0 ? totalClicked / totalDelivered : 0

  return {
    deliveryRate,
    openRate,
    clickRate
  }
}

export default function CampaignsPage() {
  // TODO: qui fetcheremo da Brevo
  const mockCampaigns = [
    { 
      id: 1, 
      name: "Welcome Email", 
      status: "sent",
      stats: {
        sent: 1000,
        delivered: 980,
        opened: 245,
        clicked: 32
      }
    },
    { 
      id: 2, 
      name: "Newsletter Marzo", 
      status: "draft"
    },
    {
      id: 3,
      name: "Promo Estate",
      status: "sent",
      stats: {
        sent: 500,
        delivered: 485,
        opened: 121,
        clicked: 15
      }
    }
  ]

  const aggregateMetrics = calculateAggregateMetrics(mockCampaigns)
  
  return (
    <div>
      <h1 className="text-2xl font-light mb-6">Le mie Campagne</h1>
      <CampaignStatsHeader metrics={aggregateMetrics} />
      <CampaignList campaigns={mockCampaigns} />
    </div>
  )
}