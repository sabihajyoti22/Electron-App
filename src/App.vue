<template>
  <h1>Hello from App.vue</h1>
  <p>Welcome to your Electron application.</p>
  <Print />
</template>

<script>
import Print from './components/Print.vue';
export default {
  components: {
    Print
  }
}
</script>