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
    countNew: number
    errorMsg: string | null
    startedAt: string
    finishedAt: string | null
}

export interface SyncResult {
    source: string
    status: 'success' | 'error'
    countNew: number
    error?: string
}