import CampaignList from './CampaignList'
import CampaignStatsHeader from './CampaignStatsHeader'
import { fetchCampaigns } from '../../lib/brevo/fetchCampaigns.js'

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
  let totalViewed = 0
  let totalClickers = 0

  sentCampaigns.forEach(campaign => {
    const { sent, delivered, viewed, clickers } = campaign.stats
    totalSent += sent || 0
    totalDelivered += delivered || 0
    totalViewed += viewed || 0
    totalClickers += clickers || 0
  })

  // Calcola percentuali
  const deliveryRate = totalSent > 0 ? totalDelivered / totalSent : 0
  const openRate = totalDelivered > 0 ? totalViewed / totalDelivered : 0
  const clickRate = totalDelivered > 0 ? totalClickers / totalDelivered : 0

  return {
    deliveryRate,
    openRate,
    clickRate
  }
}

export default async function CampaignsPage() {
  let campaigns = []
  let error = null

  try {
    campaigns = await fetchCampaigns()
  } catch (err) {
    error = err.message || 'Errore nel recupero delle campagne'
    console.error('Error fetching campaigns:', err)
  }

  const aggregateMetrics = calculateAggregateMetrics(campaigns)
  
  return (
    <div>
      <h1 className="text-2xl font-light mb-6">Le mie Campagne</h1>
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">
            <strong>Errore:</strong> {error}
          </p>
        </div>
      ) : null}
      <CampaignStatsHeader metrics={aggregateMetrics} />
      <CampaignList campaigns={campaigns} />
    </div>
  )
}