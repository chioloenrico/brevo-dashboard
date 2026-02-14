'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <nav className={styles.navbar}>
      <Link
        href="/contacts"
        className={`${styles.navLink} ${isActive('/contacts') ? styles.active : ''}`}
      >
        Contacts
      </Link>
      <Link
        href="/campaigns"
        className={`${styles.navLink} ${isActive('/campaigns') ? styles.active : ''}`}
      >
        Campaigns
      </Link>
    </nav>
  )
}
