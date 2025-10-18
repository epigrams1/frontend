import localforage from 'localforage'

localforage.config({
  name: 'epigram-vue',
  storeName: 'epigram_store'
})

export const STORAGE_KEYS = {
  userEpigrams: 'user_epigrams',
  saved: 'saved_epigrams',
  history: 'history',
  settings: 'settings'
} as const

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await localforage.getItem<T>(key)
    return v ?? fallback
  } catch {
    return fallback
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  // Ensure we store only plain data (no Proxies/Refs/Functions) to satisfy
  // IndexedDB structured clone algorithm and avoid DataCloneError
  const plain = JSON.parse(JSON.stringify(value)) as T
  await localforage.setItem<T>(key, plain)
}
