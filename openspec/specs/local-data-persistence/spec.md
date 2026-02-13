## ADDED Requirements

### Requirement: System provides SQLite database connection
The system SHALL provide a singleton database connection using `better-sqlite3` that connects to a local SQLite database file at `data/cache.db`. The connection SHALL be reused across the application and SHALL use WAL (Write-Ahead Logging) mode for improved concurrency.

#### Scenario: Database file is created on first connection
- **WHEN** the application starts and `data/cache.db` does not exist
- **THEN** the system SHALL create the database file at `data/cache.db` and establish a connection

#### Scenario: Database uses WAL mode
- **WHEN** the database connection is established
- **THEN** the system SHALL enable WAL mode using `PRAGMA journal_mode = WAL`

#### Scenario: Connection is reused across requests
- **WHEN** multiple parts of the application request the database connection
- **THEN** the system SHALL return the same singleton connection instance

### Requirement: System automatically creates database schema
The system SHALL automatically create the required database tables (`campaigns`, `cache_metadata`) if they do not exist when the application starts. The system SHALL use `CREATE TABLE IF NOT EXISTS` to ensure idempotent schema creation.

#### Scenario: Campaigns table is created on initialization
- **WHEN** the database is initialized and the `campaigns` table does not exist
- **THEN** the system SHALL create the table with columns: `id` (INTEGER PRIMARY KEY), `data` (TEXT NOT NULL), `created_at` (INTEGER NOT NULL)

#### Scenario: Cache metadata table is created on initialization
- **WHEN** the database is initialized and the `cache_metadata` table does not exist
- **THEN** the system SHALL create the table with columns: `key` (TEXT PRIMARY KEY), `timestamp` (INTEGER NOT NULL), `ttl_minutes` (INTEGER NOT NULL DEFAULT 15)

#### Scenario: Schema creation is idempotent
- **WHEN** the database is initialized and tables already exist
- **THEN** the system SHALL NOT throw errors and SHALL reuse the existing tables

### Requirement: System saves campaigns data to database
The system SHALL provide a function to save campaigns data to the `campaigns` table. The data SHALL be serialized as JSON in the `data` column, and a timestamp SHALL be stored in the `cache_metadata` table.

#### Scenario: Save campaigns with current timestamp
- **WHEN** saving campaigns data to the database
- **THEN** the system SHALL serialize the campaigns array as JSON, store it in the `data` column, and record the current timestamp in `cache_metadata` with key 'campaigns'

#### Scenario: Existing campaigns data is replaced
- **WHEN** saving campaigns data and a previous entry exists
- **THEN** the system SHALL replace the existing data with the new data

#### Scenario: Timestamp is stored in milliseconds
- **WHEN** saving campaigns data
- **THEN** the system SHALL store the timestamp as UNIX time in milliseconds (Date.now())

### Requirement: System retrieves campaigns data from database
The system SHALL provide a function to retrieve campaigns data from the `campaigns` table. The system SHALL deserialize the JSON data and return it along with the associated timestamp from `cache_metadata`.

#### Scenario: Retrieve cached campaigns with timestamp
- **WHEN** retrieving campaigns from the database and data exists
- **THEN** the system SHALL deserialize the JSON data, fetch the timestamp from `cache_metadata`, and return both

#### Scenario: Handle missing cached data
- **WHEN** retrieving campaigns from the database and no data exists
- **THEN** the system SHALL return `null` without throwing an error

#### Scenario: Handle corrupted JSON data
- **WHEN** retrieving campaigns from the database and the data column contains invalid JSON
- **THEN** the system SHALL handle the error gracefully and return `null`

### Requirement: Database file location is configurable
The system SHALL store the database file at `data/cache.db` by default. The `data/` directory SHALL be created automatically if it does not exist.

#### Scenario: Create data directory on first use
- **WHEN** the database is initialized and the `data/` directory does not exist
- **THEN** the system SHALL create the directory before creating the database file

#### Scenario: Database file path is documented
- **WHEN** setting up the project
- **THEN** the documentation SHALL instruct developers to add `data/cache.db` to `.gitignore`

### Requirement: Database connection is exported as module
The system SHALL export the database connection and setup function from a dedicated module (`lib/db.js`) to allow reuse across the application.

#### Scenario: Database module is available as import
- **WHEN** importing from `lib/db.js`
- **THEN** the system SHALL provide access to the initialized database connection

#### Scenario: Setup function creates schema on demand
- **WHEN** the setup function is called
- **THEN** the system SHALL ensure the database file exists, create tables if needed, and return the connection

### Requirement: System handles database errors gracefully
The system SHALL handle database errors (connection failures, disk full, permissions) gracefully and provide meaningful error messages.

#### Scenario: Handle connection failure
- **WHEN** the database connection fails (e.g., disk full, permissions issue)
- **THEN** the system SHALL throw an error with a descriptive message indicating the database connection failure

#### Scenario: Handle write errors
- **WHEN** saving data to the database fails (e.g., disk full)
- **THEN** the system SHALL throw an error with a descriptive message and NOT corrupt existing data
