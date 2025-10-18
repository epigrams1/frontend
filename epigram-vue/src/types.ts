export type EpigramSource = 'system' | 'user'

export interface Epigram {
  id: string
  text: string
  author?: string
  source: EpigramSource
  type?: string
  field?: string
  createdAt: number
  categories?: string[]
}

export interface HistoryEntry {
  id: string
  shownAt: number
}

export interface SavedEntry {
  id: string
  savedAt: number
  categories?: string[]
}

export interface Filters {
  types: string[]
  fields: string[]
  categories: string[]
  source: 'all' | 'system' | 'user'
}

export interface Settings {
  autoRotateSeconds: number
  ownSharePercent: number
  ownShareWindowMinutes: number
  maxHistoryCount: number
  filters: Filters
}
