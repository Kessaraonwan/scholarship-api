export interface Scholarship {
    name: string
    level: string
    field: string
    country: string
    deadline?: string
    amount?: number
    currency?: string
    url: string
    source: string
    description?: string
}

export interface IngestionLog {
    id: string
    source: string
    status: 'success' | 'error' | 'running'
    count_new: number
    error_msg: string | null
    started_at: string
    finished_at: string | null
}

export interface SyncResult {
    source: string
    status: 'success' | 'error'
    countNew: number
    error?: string
}