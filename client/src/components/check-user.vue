<template>
  <div id="check-user">
      <form>
        <md-layout md-gutter>
          <md-layout md-flex="50">
            <md-input-container>
              <label>Usuário</label>
              <md-input v-model="user" class="md-inline"></md-input>
              <br>
            </md-input-container>
            <md-progress v-if="searching" md-indeterminate></md-progress>
            <label id="message">{{msg}}</label>
          </md-layout>
          <md-layout>
            <md-button @click="check" class="md-primary">
              <md-icon>find_in_page</md-icon>
              <md-tooltip md-direction="top">Search for a user</md-tooltip>
            </md-button>
          </md-layout>      
        </md-layout>
      </form>
    <md-layout>
      <md-button class="md-primary" @click="listUsers">
        <md-icon>playlist_add_check</md-icon>
        <md-tooltip md-direction="top">List all users inserted</md-tooltip>
      </md-button>
    </md-layout>
  </div>  
</template>

<script>
const VueRouter = require("vue-router");
const axios = require("axios");
const api = axios.create({
  baseURL: "http://localhost:3000"
});

module.exports = {
  name: "check-user",
  data () {
    return {
      user: '',
      msg: '',
      searching: false
    }
  },
  methods: {
    check() {
      this.searching = true;
      api.post('/check', {user: this.user}).then(ret => {
        this.msg = ret.data.msg;
        this.searching = false;
      }).catch(err => {
        this.msg = err.response.data.msg;
        this.searching = false;
      })

    },
    listUsers() {
      this.$router.push('/list-users')
    }
  }
};
</script>

<style scoped>
  #app {
    margin-top: 30px;
    margin-left: 100px;
    margin-right: 100px;
  }

  #message {
    color: #aaa;
    font-size: 14px;
  }
</style>