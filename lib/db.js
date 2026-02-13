import Database from 'better-sqlite3'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

// Database file path
const DB_PATH = join(process.cwd(), 'data', 'cache.db')

// Singleton connection
let dbInstance = null

/**
 * Get or create the singleton database connection
 */
function getDb() {
  if (!dbInstance) {
    // Ensure data/ directory exists before creating database file
    const dbDir = dirname(DB_PATH)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    // Create database connection
    dbInstance = new Database(DB_PATH)

    // Enable WAL mode for improved concurrency
    dbInstance.pragma('journal_mode = WAL')

    // Initialize schema
    setupSchema(dbInstance)
  }

  return dbInstance
}

/**
 * Setup database schema (idempotent - safe to call multiple times)
 */
function setupSchema(db) {
  // Create campaigns table with id, data (JSON), and timestamp
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `)

  // Create cache_metadata table for tracking timestamps and TTL
  db.exec(`
    CREATE TABLE IF NOT EXISTS cache_metadata (
      key TEXT PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      ttl_minutes INTEGER NOT NULL DEFAULT 15
    );
  `)
}

/**
 * Save campaigns data to the database
 * @param {Array} data - Array of campaign objects
 */
export function saveCampaigns(data) {
  const db = getDb()
  const now = Date.now()

  // Serialize campaigns array as JSON
  const jsonData = JSON.stringify(data)

  // Start transaction for atomic write
  const saveData = db.transaction(() => {
    // Insert/replace data in campaigns table
    db.prepare(`
      INSERT OR REPLACE INTO campaigns (id, data, created_at)
      VALUES (1, ?, ?)
    `).run(jsonData, now)

    // Update cache_metadata with current timestamp
    db.prepare(`
      INSERT OR REPLACE INTO cache_metadata (key, timestamp, ttl_minutes)
      VALUES ('campaigns', ?, 15)
    `).run(now)
  })

  saveData()
}

/**
 * Get cached campaigns data from the database
 * @returns {Object|null} - { data: Array, timestamp: number } or null if no cache
 */
export function getCachedCampaigns() {
  try {
    const db = getDb()

    // Retrieve data from campaigns table
    const campaignRow = db.prepare(`
      SELECT data, created_at FROM campaigns WHERE id = 1
    `).get()

    // Retrieve timestamp from cache_metadata
    const metadataRow = db.prepare(`
      SELECT timestamp FROM cache_metadata WHERE key = 'campaigns'
    `).get()

    // Handle missing data gracefully
    if (!campaignRow || !metadataRow) {
      return null
    }

    // Deserialize JSON data
    try {
      const campaigns = JSON.parse(campaignRow.data)
      return {
        data: campaigns,
        timestamp: metadataRow.timestamp
      }
    } catch (parseError) {
      // Handle corrupted JSON gracefully
      console.error('Failed to parse cached campaigns JSON:', parseError)
      return null
    }
  } catch (error) {
    // Handle database errors gracefully
    console.error('Error retrieving cached campaigns:', error)
    return null
  }
}

// Export database connection and setup function
export { getDb, setupSchema }
