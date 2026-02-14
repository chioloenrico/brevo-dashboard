"use client"

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function BlacklistBadge({ isBlacklisted }) {
  if (!isBlacklisted) return null

  return (
    <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
      Blacklisted
    </span>
  )
}

export default function ContactList({ contacts }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-foreground/10 border border-foreground/10 rounded-lg">
        <thead className="bg-foreground/5">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Email
            </th>
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
              Cognome
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Data Creazione
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-foreground/10">
          {contacts.map((contact, index) => {
            const isEven = index % 2 === 0

            return (
              <tr
                key={contact.email || index}
                className={`hover:bg-foreground/5 ${
                  isEven ? 'bg-background' : 'bg-foreground/2'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-left">
                  {contact.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-left">
                  {contact.firstName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-left">
                  {contact.lastName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-left">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                  <BlacklistBadge isBlacklisted={contact.emailBlacklisted} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
