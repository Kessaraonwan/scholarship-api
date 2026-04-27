import pool from './db'
import { Scholarship } from './scrapers/baseScraper'

export interface IngestionLog {
  id: string
  source: string
  status: 'success' | 'error' | 'running'
  count_new: number
  error_msg: string | null
  started_at: string
  finished_at: string | null
}

export class IngestionService {
  async createLog(source: string): Promise<string> {
    const result = await pool.query(`
      INSERT INTO ingestion_logs (source, status, started_at)
      VALUES ($1, 'running', NOW())
      RETURNING id
    `, [source])

    return result.rows[0].id
  }

  async updateLog(id: string, status: 'success' | 'error', countNew: number = 0, errorMsg: string | null = null): Promise<void> {
    await pool.query(`
      UPDATE ingestion_logs
      SET status = $1, count_new = $2, error_msg = $3, finished_at = NOW()
      WHERE id = $4
    `, [status, countNew, errorMsg, id])
  }

  async saveScholarships(scholarships: Scholarship[]): Promise<number> {
    let count = 0

    for (const scholarship of scholarships) {
      try {
        // Check if scholarship already exists (by name and source)
        const existing = await pool.query(`
          SELECT id FROM scholarships
          WHERE name = $1 AND source = $2
        `, [scholarship.name, scholarship.source])

        if (existing.rows.length === 0) {
          await pool.query(`
            INSERT INTO scholarships (name, level, field, country, deadline, amount, currency, url, source, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [
            scholarship.name,
            scholarship.level,
            scholarship.field,
            scholarship.country,
            scholarship.deadline,
            scholarship.amount,
            scholarship.currency,
            scholarship.url,
            scholarship.source,
            scholarship.description
          ])
          count++
        }
      } catch (error) {
        console.error('Error saving scholarship:', scholarship.name, error)
      }
    }

    return count
  }

  async getLatestLog(): Promise<IngestionLog | null> {
    const result = await pool.query(`
      SELECT * FROM ingestion_logs
      ORDER BY started_at DESC
      LIMIT 1
    `)

    return result.rows[0] || null
  }

  async getLogs(page: number = 1, limit: number = 20): Promise<{ logs: IngestionLog[], total: number }> {
    const offset = (page - 1) * limit

    const [logs, count] = await Promise.all([
      pool.query(`
        SELECT * FROM ingestion_logs
        ORDER BY started_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
      pool.query(`SELECT COUNT(*) FROM ingestion_logs`)
    ])

    return {
      logs: logs.rows,
      total: parseInt(count.rows[0].count)
    }
  }
}