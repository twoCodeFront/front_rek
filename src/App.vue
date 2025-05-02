<script setup lang="ts">
import {useAuthStore} from "@/store/auth.store.ts";
import {useInvoiceStore} from "@/store/invoiceStore.ts";
import {onMounted} from "vue";

const authStore = useAuthStore();
const invoiceStore = useInvoiceStore();

const logIn = () => {
  console.log('authStore.logIn');
  authStore.login(
      '*****',
      '*****'
  )
}

const getInvoices = () => {
  invoiceStore.fetchFindAllInvoices(1);
}

onMounted(() => {
  getInvoices();
  if (authStore.isLoggedIn && !authStore.user) {
    authStore.getUser();
  }

})

const logOut = () => {
  authStore.logout();
}

</script>

<template>
  <div class="block">
    <button v-if="!authStore.isLoggedIn" class="btn" @click="logIn">LogIn</button>
    <button v-else class="btn" @click="logOut">Wyloguj</button>
    {{ authStore.isLoggedIn }}
    <div>
      {{ authStore.user }}
    </div>
  </div>
  <div class="block" style="margin-top: 40px">
    {{invoiceStore.invoicePagination.data}}
  </div>

</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
}

.btn {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
}
</style>
