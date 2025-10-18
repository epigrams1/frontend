<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useEpigramStore } from "../stores/epigrams";
import RandomEpigram from "../components/RandomEpigram.vue";
import EpigramCard from "../components/EpigramCard.vue";

const store = useEpigramStore();
const auth = useAuthStore();
const scrollEl = ref<HTMLDivElement | null>(null);
const timerId = ref<number | undefined>(undefined);
const showHint = ref(true);
const historyRef = ref<HTMLDivElement | null>(null);

const historyList = computed(() => store.history);
const visibleCount = ref(20);
const sortedHistory = computed(() =>
  [...historyList.value].sort((a, b) => b.shownAt - a.shownAt)
);
const pagedHistory = computed(() =>
  sortedHistory.value.slice(0, visibleCount.value)
);
function loadMore() {
  visibleCount.value += 20;
}
const current = computed(() => store.currentEpigram);

// No auto-scroll: we start at the top and history is below.

async function next() {
  if (auth.loggedIn) {
    await store.showNext();
  } else {
    await store.showNextNoHistory();
  }
}
function save() {
  if (!auth.loggedIn) return;
  store.saveCurrent();
}

onMounted(async () => {
  await store.init();
  if (!store.currentEpigram) await next();
  setupTimer();
  scrollEl.value?.addEventListener("scroll", onScroll);
  // Initialize visibility based on current scroll
  onScroll();
});

function setupTimer() {
  clearTimer();
  const interval = auth.loggedIn
    ? Math.max(0, store.settings.autoRotateSeconds) * 1000
    : 5000;
  if (interval > 0) {
    timerId.value = window.setInterval(next, interval);
  }
}
function clearTimer() {
  if (timerId.value) {
    clearInterval(timerId.value);
    timerId.value = undefined;
  }
}

watch(() => store.settings.autoRotateSeconds, setupTimer);
watch(() => auth.loggedIn, setupTimer);

function onScroll() {
  const el = scrollEl.value;
  if (!el) return;
  const atTop = el.scrollTop <= 1;
  showHint.value = atTop;
  // No clear button toggle here; it is rendered inside history and appears when history enters view
}

onBeforeUnmount(() => {
  clearTimer();
  scrollEl.value?.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <div class="home" ref="scrollEl">
    <div class="current">
      <RandomEpigram :epigram="current">
        <template #actions v-if="auth.loggedIn">
          <button @click="next">New</button>
          <button @click="save">Save</button>
        </template>
      </RandomEpigram>
      <div
        v-if="auth.loggedIn && showHint && sortedHistory.length > 0"
        class="hint in-current"
      >
        <div class="arrow"></div>
        <div>scroll down to see the history</div>
      </div>
    </div>

    <div class="history" ref="historyRef">
      <EpigramCard
        v-for="(h, idx) in pagedHistory"
        :key="h.shownAt + '-' + idx"
        :epigram="store.allEpigrams.find(e => e.id === h.id)!"
      />
      <div v-if="sortedHistory.length > visibleCount" class="more">
        <button class="outline" @click="loadMore">Load more</button>
      </div>
      <div v-if="auth.loggedIn && sortedHistory.length > 0" class="clearfab">
        <button class="danger" @click="store.clearHistory()">
          Delete history
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px;
}
.history {
  display: flex;
  flex-direction: column;
}
.more {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
button.outline {
  background: #fff;
  color: #111827;
}
.current {
  position: relative;
}
button {
  padding: 8px 12px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease,
    transform 0.05s ease;
}
button:hover {
  background-color: #0e1625;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
button:active {
  transform: translateY(1px);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}
.clearbar {
  position: sticky;
  top: 8px;
  display: flex;
  justify-content: flex-end;
  z-index: 20;
  background: #fff;
  padding: 8px 0;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
button.danger {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}
button.danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}
button.outline:hover {
  background: #111827;
  color: #fff;
}
.hint {
  position: sticky;
  bottom: 48px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
  font-size: 0.9rem;
  pointer-events: none;
}
.hint.in-current {
  position: absolute;
  left: 50%;
  bottom: 20px; /* lower so it's closer to the bottom and fully visible */
  transform: translateX(-50%);
  z-index: 5;
}
.arrow {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #6b7280; /* point up */
  margin-bottom: 4px;
  animation: bounceUp 1.2s infinite;
}
@keyframes bounceUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
/* Floating clear button inside the history section */
.clearfab {
  position: sticky;
  bottom: 8px;
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  z-index: 20;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.9) 40%,
    #fff 100%
  );
}
</style>
