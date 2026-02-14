import ContactList from './ContactList'
import ContactStatsHeader from './ContactStatsHeader'
import { getContacts } from '../../lib/repositories/contacts.js'

export default async function ContactsPage() {
  let contacts = []
  let error = null

  try {
    contacts = await getContacts()
  } catch (err) {
    error = err.message || 'Errore nel recupero dei contatti'
    console.error('Error fetching contacts:', err)
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-6">I miei Contatti</h1>
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">
            <strong>Errore:</strong> {error}
          </p>
        </div>
      ) : null}
      {contacts.length === 0 && !error ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200">
            Nessun contatto disponibile
          </p>
        </div>
      ) : null}
      <ContactStatsHeader contacts={contacts} />
      <ContactList contacts={contacts} />
    </div>
  )
}
