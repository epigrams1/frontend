<!-- <script setup>

import { useAuth } from "@/stores/auth.js";
import { onMounted, ref } from "vue";
import {$axios} from "@/axios.js";

const items = ref([]);
const authStore = useAuth();
const putStatus = ref(null);
const courses = ref([]);
const showTokenInput = ref(false);
const loadingData = ref(true);

const fields = [
  { key: 'property', label: '' },
  { key: 'value', label: '' }
];

onMounted(async () => {
  await authStore.fetchUserData();
  if (authStore.user) {
    const userDataArray = Array.isArray(authStore.user) ? authStore.user : [authStore.user];
    items.value = userDataArray.flatMap(user => {
      return [
        { property: 'University ID', value: user.utid },
        { property: 'Full Name', value: user.name },
        { property: 'University Email', value: user.email },
        { property: 'Canvas Token', value: null },
      ];
    });
  }
  await fetchCourses();
  loadingData.value = false;
});

const fetchCourses = async () => {
  try {
    const promises = authStore.user.authorities.map(authority => {
      return $axios.get(`/course/${authority.courseId}`);
    });
    const responses = await Promise.all(promises);
    courses.value = responses.map((response, index) => ({
      ...response.data,
      role: authStore.user.authorities[index].role
    }));
  } catch (error) {}
};

const updateCanvasToken = async (newValue) => {
  try {
    await $axios.put('/account/canvas-token', { token: newValue });
    const canvasTokenIndex = items.value.findIndex(item => item.property === 'Canvas Token');
    if (canvasTokenIndex !== -1) {
      items.value[canvasTokenIndex].value = newValue;
    }
    putStatus.value = 'success';
    showTokenInput.value = false;
    setTimeout(async () => {
      putStatus.value = null;
      await authStore.fetchUserData();
    }, 3000);
  } catch (error) {
    putStatus.value = 'failure';
    setTimeout(() => {
      putStatus.value = null;
    }, 3000);
  }
};

const toggleInput = (row) => {
  row.item.value = '';
  showTokenInput.value = !showTokenInput.value;
};

</script>

<template>
  <div v-if="loadingData">
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <BSpinner style="width: 5rem; height: 5rem;" variant="primary" />
    </div>
  </div>

  <div v-else class="course-container">
    <div class="bold-blue">My Information</div>
    <b-container fluid>
      <b-table
          :fields="fields"
          :items="items"
          responsive="sm"
          striped
          hover
          style="padding-right: 12rem;"
      >
        <template #cell(value)="row">
          <template v-if="row.item.property === 'Canvas Token'">
            <div class="canvas-token-cell">
              <div class="input-container">
                <b-form-input
                    v-if="showTokenInput"
                    v-model="row.item.value"
                    :class="{ 'is-success': putStatus === 'success', 'is-danger': putStatus === 'failure' }"
                    @keyup.enter="updateCanvasToken(row.item.value)"
                    class="field-width btn-margin-right"
                    placeholder="Insert your new canvas token"
                ></b-form-input>
                <b-button class="btn-blue-dark btn-margin-right" v-if="showTokenInput" @click="updateCanvasToken(row.item.value)">Save change</b-button>
                <b-button class="btn-blue-dark" @click="toggleInput(row)">
                  {{ showTokenInput ? 'Cancel' : (authStore.user.canvasTokenDefined !== false ? 'Change' : 'Add token' ) }}
                </b-button>
              </div>
              <div>
                <span v-if="putStatus === 'success'" class="updated-text">Updated!</span>
                <span v-if="putStatus === 'failure'" class="not-valid">Canvas token is not valid!</span>
              </div>
            </div>
          </template>
          <template v-else-if="row.item.property === 'My courses'">
            <div>{{ row.item.value }}</div>
          </template>
          <template v-else>
            <div>{{ row.item.value }}</div>
          </template>
        </template>
      </b-table>
    </b-container>

    <div class="bold-blue">My Courses</div>

    <div>
      <ul v-if="courses.length">
        <li v-for="course in courses" :key="course.id">
          <div class="course-card">
            <div class="card-content">
              <h5 class="course-name">
                <router-link :to="{ name: 'course_assignments', params: { course_id: course.id } }" style="text-decoration: none">
                  {{ course.name }} ({{ course.year }})
                </router-link>
                | My Role: {{ course.role }}
              </h5>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>You are not enrolled in any courses.</p>
    </div>
  </div>
</template>

<style scoped>
</style> -->


<script>



export default {
  methods: {
  }
};

</script>

<template>
  <div>
    <p>sdgsgsdgds</p>
    
  </div>
</template>

<style>
</style>
