<script setup lang="ts">
import { ref } from 'vue'
import { useEpigramStore } from '../stores/epigrams'
import EpigramEditor from '../components/EpigramEditor.vue'
import EpigramCard from '../components/EpigramCard.vue'
import type { Epigram } from '../types'

const store = useEpigramStore()

const editingId = ref<string|null>(null)
const editing = ref<Epigram|null>(null)

async function addNew(payload: { text: string; author?: string; type?: string; field?: string }) {
  await store.addUserEpigram(payload)
}
function startEdit(e: Epigram) {
  editingId.value = e.id
  editing.value = { ...e }
}
async function saveEdit(payload: { text: string; author?: string; type?: string; field?: string }) {
  if (!editingId.value) return
  await store.updateUserEpigram(editingId.value, payload)
  editingId.value = null
  editing.value = null
}
function cancelEdit() {
  editingId.value = null
  editing.value = null
}
function remove(id: string) {
  store.deleteUserEpigram(id)
}
</script>

<template>
  <div class="page">
    <h2>Add new epigram</h2>
    <EpigramEditor @save="addNew" />

    <h2>My epigrams</h2>
    <div v-if="store.userEpigrams.length === 0" class="empty">No epigrams yet.</div>
    <div v-for="e in store.userEpigrams" :key="e.id" class="item">
      <template v-if="editingId === e.id">
        <EpigramEditor v-model="editing" @save="saveEdit" />
        <div class="row">
          <button class="outline" @click="cancelEdit">Cancel</button>
        </div>
      </template>
      <template v-else>
        <EpigramCard :epigram="e" />
        <div class="row">
          <button @click="startEdit(e)">Edit</button>
          <button class="danger" @click="remove(e.id)">Delete</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page{padding:16px}
.item{margin-bottom:12px}
.row{display:flex;gap:8px;margin-top:6px}
button{padding:8px 12px;border:1px solid #111827;border-radius:8px;background:#111827;color:#fff}
button.outline{background:#fff;color:#111827}
button.danger{background:#dc2626;border-color:#dc2626}
.empty{color:#6b7280}
</style>
