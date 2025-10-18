import router from "./router";
import { createApp } from "vue";
import { createPinia } from 'pinia';
import {createBootstrap} from 'bootstrap-vue-next';
import {$axios} from './axios.js';
import App from "./App.vue";
import vuetify from './plugins/vuetify'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap";

export const pinia = createPinia();

const app = createApp(App);
app.use(createPinia());
app.use(vuetify);
app.use(createBootstrap({}))
app.use(router);

pinia.use(({store}) => {
    store.router = router;
})

app.provide('$axios', $axios);
app.mount("#app");
