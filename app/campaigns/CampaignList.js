"use client"

export default function CampaignList({ campaigns }) {
    return (
        <div>
            <ul>
                {campaigns.map((campaign) => (
                    <li key={campaign.id}>{campaign.name}</li>
                ))}
            </ul>
        </div>
    )
}