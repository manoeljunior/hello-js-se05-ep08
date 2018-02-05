<template>
  <div>
    <md-layout md-align="center" md-gutter="20">
      <md-layout md-align="center" md-flex="100">
        <h1>Final project - Hello.js</h1>
      </md-layout>
  
      <md-layout md-flex-small="100" md-flex="50">
        <form @submit.prevent="check">
          <md-input-container>
            <label>Usuário</label>
            <md-input v-model="user" required></md-input>
          </md-input-container>
        </form>
      </md-layout>
      <router-view></router-view>
    </md-layout>
    
  </div>
</template>

<script>
const VueRouter = require("vue-router");

module.exports = {
  name: "App",
  data () {
    return {
      user: 'tesst'
    }
  },
  methods: {
    check() {

    }
  }
};
</script>

<style scoped>

</style>