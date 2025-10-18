import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { SYSTEM_EPIGRAMS } from '../data/systemEpigrams'
import type { Epigram, HistoryEntry, SavedEntry, Settings } from '../types'
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage'
import { categorize } from '../utils/categorize'

export const useEpigramStore = defineStore('epigrams', {
  state: () => ({
    userEpigrams: [] as Epigram[],
    saved: [] as SavedEntry[],
    history: [] as HistoryEntry[],
    settings: {
      autoRotateSeconds: 0,
      ownSharePercent: 30,
      ownShareWindowMinutes: 60,
      maxHistoryCount: 500,
      filters: { types: [], fields: [], categories: [], source: 'all' as const }
    } as Settings,
    lastShownId: null as string | null,
    systemEpigrams: SYSTEM_EPIGRAMS as Epigram[]
  }),
  getters: {
    allEpigrams(state): Epigram[] {
      return [...state.systemEpigrams, ...state.userEpigrams]
    },
    savedEpigrams(state): Epigram[] {
      const map = new Map(this.allEpigrams.map(e => [e.id, e]))
      return state.saved
        .map(s => map.get(s.id))
        .filter((e): e is Epigram => !!e)
    },
    currentEpigram(state): Epigram | null {
      if (!state.lastShownId) return null
      return this.allEpigrams.find(e => e.id === state.lastShownId) || null
    },
    recentWindow(state): HistoryEntry[] {
      const now = Date.now()
      const start = now - this.settings.ownShareWindowMinutes * 60_000
      return state.history.filter(h => h.shownAt >= start)
    },
    recentOwnShare(): number {
      const entries = this.recentWindow
      if (entries.length === 0) return 0
      const map = new Map(this.allEpigrams.map(e => [e.id, e]))
      const ownCount = entries.reduce((acc, h) => acc + (map.get(h.id)?.source === 'user' ? 1 : 0), 0)
      return (ownCount / entries.length) * 100
    }
  },
  actions: {
    async init() {
      this.userEpigrams = await getItem(STORAGE_KEYS.userEpigrams, [])
      this.saved = await getItem(STORAGE_KEYS.saved, [])
      this.history = await getItem(STORAGE_KEYS.history, [])
      this.settings = await getItem(STORAGE_KEYS.settings, this.settings)
      if (this.settings.maxHistoryCount == null || isNaN(Number(this.settings.maxHistoryCount))) {
        this.settings.maxHistoryCount = 500
      }
      if (this.systemEpigrams.length === 0) {
        this.systemEpigrams = SYSTEM_EPIGRAMS
      }
      if (!this.lastShownId && this.history.length > 0) {
        const last = this.history[this.history.length - 1]!
        this.lastShownId = last.id
      }
      // Enforce cap on load
      if (this.history.length > this.settings.maxHistoryCount) {
        this.history.splice(0, this.history.length - this.settings.maxHistoryCount)
        await setItem(STORAGE_KEYS.history, this.history)
      }
    },
    async persist() {
      await Promise.all([
        setItem(STORAGE_KEYS.userEpigrams, this.userEpigrams),
        setItem(STORAGE_KEYS.saved, this.saved),
        setItem(STORAGE_KEYS.history, this.history),
        setItem(STORAGE_KEYS.settings, this.settings)
      ])
    },
    filterPool(pool: Epigram[]): Epigram[] {
      const f = this.settings.filters
      return pool.filter(e => {
        if (f.source !== 'all' && e.source !== f.source) return false
        if (f.types.length && (!e.type || !f.types.includes(e.type))) return false
        if (f.fields.length && (!e.field || !f.fields.includes(e.field))) return false
        if (f.categories.length) {
          const cats = e.categories || []
          if (!cats.some(c => f.categories.includes(c))) return false
        }
        return true
      })
    },
    pickFrom(pool: Epigram[], avoidId?: string | null): Epigram | null {
      const list = pool.filter(e => e.id !== avoidId)
      if (list.length === 0) return null
      const idx = Math.floor(Math.random() * list.length)
      return list[idx] ?? null
    },
    pickNext(): Epigram | null {
      const all = this.allEpigrams
      const userPool = all.filter(e => e.source === 'user')
      const avoidId = this.lastShownId

      const windowShare = this.recentOwnShare
      const target = this.settings.ownSharePercent

      let candidate: Epigram | null = null

      if (userPool.length > 0 && windowShare < target) {
        candidate = this.pickFrom(this.filterPool(userPool), avoidId)
        if (candidate) return candidate
      }

      candidate = this.pickFrom(this.filterPool(all), avoidId)
      if (candidate) return candidate

      candidate = this.pickFrom(all, avoidId)
      if (candidate) return candidate

      return this.pickFrom(all, null)
    },
    async showNext() {
      const e = this.pickNext()
      if (!e) return
      this.lastShownId = e.id
      this.history.push({ id: e.id, shownAt: Date.now() })
      if (this.history.length > this.settings.maxHistoryCount) {
        this.history.splice(0, this.history.length - this.settings.maxHistoryCount)
      }
      await setItem(STORAGE_KEYS.history, this.history)
    },
    async showNextNoHistory() {
      const e = this.pickNext()
      if (!e) return
      this.lastShownId = e.id
      // Do not mutate history or persist it
    },
    async saveCurrent() {
      if (!this.lastShownId) return
      if (this.saved.some(s => s.id === this.lastShownId)) return
      const ep = this.allEpigrams.find(e => e.id === this.lastShownId)
      const cats = ep ? categorize(ep.text) : undefined
      this.saved.push({ id: this.lastShownId, savedAt: Date.now(), categories: cats })
      await setItem(STORAGE_KEYS.saved, this.saved)
    },
    async deleteSaved(id: string) {
      this.saved = this.saved.filter(s => s.id !== id)
      await setItem(STORAGE_KEYS.saved, this.saved)
    },
    async deleteSavedMany(ids: string[]) {
      const set = new Set(ids)
      this.saved = this.saved.filter(s => !set.has(s.id))
      await setItem(STORAGE_KEYS.saved, this.saved)
    },
    async clearSaved() {
      this.saved = []
      await setItem(STORAGE_KEYS.saved, this.saved)
    },
    async addUserEpigram(payload: { text: string; author?: string; type?: string; field?: string }) {
      const e: Epigram = {
        id: uuidv4(),
        text: payload.text,
        author: payload.author,
        source: 'user',
        type: payload.type,
        field: payload.field,
        createdAt: Date.now(),
        categories: categorize(payload.text)
      }
      this.userEpigrams.push(e)
      await setItem(STORAGE_KEYS.userEpigrams, this.userEpigrams)
      return e
    },
    async updateUserEpigram(id: string, payload: Partial<Pick<Epigram, 'text'|'author'|'type'|'field'|'categories'>>) {
      const idx = this.userEpigrams.findIndex(e => e.id === id)
      if (idx === -1) return
      const prev = this.userEpigrams[idx]!
      const updated: Epigram = {
        id: prev.id,
        text: payload.text ?? prev.text,
        author: payload.author ?? prev.author,
        source: prev.source,
        type: payload.type ?? prev.type,
        field: payload.field ?? prev.field,
        createdAt: prev.createdAt,
        categories: payload.categories ?? prev.categories
      }
      this.userEpigrams[idx] = updated
      await setItem(STORAGE_KEYS.userEpigrams, this.userEpigrams)
    },
    async deleteUserEpigram(id: string) {
      this.userEpigrams = this.userEpigrams.filter(e => e.id !== id)
      this.saved = this.saved.filter(s => s.id !== id)
      this.history = this.history.filter(h => h.id !== id)
      await this.persist()
    },
    setAutoRotateSeconds(sec: number) {
      this.settings.autoRotateSeconds = Math.max(0, Math.floor(sec))
      setItem(STORAGE_KEYS.settings, this.settings)
    },
    setOwnShare(percent: number) {
      this.settings.ownSharePercent = Math.max(0, Math.min(100, Math.floor(percent)))
      setItem(STORAGE_KEYS.settings, this.settings)
    },
    setOwnShareWindowMinutes(min: number) {
      this.settings.ownShareWindowMinutes = Math.max(1, Math.floor(min))
      setItem(STORAGE_KEYS.settings, this.settings)
    },
    setMaxHistoryCount(count: number) {
      const n = Math.max(0, Math.floor(Number(count) || 0))
      this.settings.maxHistoryCount = n
      // Trim immediately if needed
      if (this.history.length > n) {
        this.history.splice(0, this.history.length - n)
        setItem(STORAGE_KEYS.history, this.history)
      }
      setItem(STORAGE_KEYS.settings, this.settings)
    },
    async clearHistory() {
      this.history = []
      await setItem(STORAGE_KEYS.history, this.history)
    },
    setFilters(filters: Partial<Settings['filters']>) {
      this.settings.filters = { ...this.settings.filters, ...filters }
      setItem(STORAGE_KEYS.settings, this.settings)
    },
    resetFilters() {
      this.settings.filters = { types: [], fields: [], categories: [], source: 'all' }
      setItem(STORAGE_KEYS.settings, this.settings)
    }
  }
})
