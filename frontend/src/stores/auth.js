import { defineStore } from "pinia";
import {$axios} from "@/axios.js";
import router from "@/router/index.js";

export const useAuth = defineStore({
    id: "auth_store",
    state: () => ({
        user: undefined,
        user_loaded: false,
        coordinator: false
    }),

    actions: {
        async fetchUserData() {
            this.user_loaded = false;
            await $axios.get("/account/current")
                .then(({ data }) => {
                    this.user = data;
                })
                .catch(() => {
                    this.user = undefined;
                }).finally(() => {

                    this.user_loaded = true;
                });
        },

        // Deprecated, we use above
        // Maybe add support for non-okta login later on again
        // async login() {
        //     // http://localhost:8080/api/v1/saml2/authenticate/okta // for saml
        //     await $axios.get("/account/current")
        //         .then(({ data }) => {
        //             // localStorage.setItem('user', JSON.stringify(data));
        //             this.user = JSON.stringify(data);
        //             router.push({name: 'courses'})
        //
        //         })
        //         .catch(() => {
        //             // localStorage.setItem('user', JSON.stringify(null));
        //             this.user = undefined;
        //         });
        // },

        logout() {
            localStorage.removeItem('user');
            this.user = null;
            // Delete 'JSESSIONID' cookie
            console.log("Logout")
            console.log(document.cookie)
            document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            console.log(document.cookie)
            // router.push({name: 'login'})
        },

        // updateUser(user){
        //     localStorage.setItem('user', JSON.stringify(user));
        //     this.user = JSON.parse(localStorage.getItem('user'));
        // },

        setCoordinator(courseId) {
            this.coordinator =  this.user.authorities.some(authority => authority.authority === courseId + '/COORDINATOR' || authority.authority === 'ADMIN');
        },
    },

    getters: {
        isAuth(state) {
            return !!state.user;
        },
        isLoaded(state){
            return state.user_loaded;
        },

        isCoordinator(state) {
            return state.coordinator;
        },

        getToken(state) {
            if (state.user == null){
                return null;
            }
            return state.user.canvasToken
        }
    }
})
