<script setup>
import {useAuth} from "@/stores/auth.js";

const authStore = useAuth();
//  TODO When connecting to google this URL possible to be changed. 
const base_url =  'http://localhost:8080';
</script>

<template>
  <div class="background-image">
    <section
        class="bck d-flex justify-content-center align-items-center align-self-center position-relative py-4 py-xl-5">
      <div class="container">
        <div class="row d-flex justify-content-center" >
          <div id="login-section" >
              <div class="d-flex flex-column align-items-center"  v-if="authStore.isLoaded">
                <img src="../../src/assets/images/epigramia.png" style="width: 17.188rem;padding-top: 0;margin-top: 0.625rem;">
                <form class="text-center" method="post">
                  <p style="margin-top: 16px;color: #22335a; padding-left: 1rem;">A concise thought - an infinite reflection</p>
                  <div class="mb-3">
                      <!-- TODO add link to coonect to google  -->

                      <a
                         class="btn btn-primary d-block w-100"
                         role="button"
                         :href="base_url+'/saml2/authenticate/okta'"
                         style="
                        margin-top: 39px;
                        background: #22335a;
                        border-color: #22335a;
                      "
                      >LOGIN WITH GOOGLE</a>
                  </div>
                </form>
              </div>
            <div class="d-flex flex-column align-items-center"  v-else>
              <BSpinner style="width: 5rem; height: 5rem;" variant="primary" class="mb-5"/>
              Loading
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
</style>
