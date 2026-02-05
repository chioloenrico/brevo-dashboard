
import CampaignList from './CampaignList'

export default function CampaignsPage() {
  // TODO: qui fetcheremo da Brevo
  const mockCampaigns = [
    { id: 1, name: "Welcome Email", status: "sent" },
    { id: 2, name: "Newsletter Marzo", status: "draft" }
  ]
  
  return (
    <div>
      <h1>Le mie Campagne</h1>
      <CampaignList campaigns={mockCampaigns} />
    </div>
  )
}