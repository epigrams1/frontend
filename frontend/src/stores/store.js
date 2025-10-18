import { defineStore } from "pinia";
import {$axios} from "@/axios.js";

defineStore({
    id: "main_store",
    state: () => ({
        user: null,
    }),

    actions: {
        async fetchUserData() {
            await $axios.get("/account/current")
                .then(({ data }) => {
                    this.user = data;
                })
                .catch(() => {});
        }
    },

    getters: {
        isAuth(state) {
            return state.user !== null;
        }
    }
});
