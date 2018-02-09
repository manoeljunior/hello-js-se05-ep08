<template>
  <div id="check-user">
    <form>
      <md-layout md-gutter>
        <md-layout md-flex="100">
          <md-input-container>
            <label>Aluno</label>
            <md-input v-model="user" class="md-inline"></md-input>
            <br>
          </md-input-container>
          <md-progress v-if="searching" md-indeterminate></md-progress>
          <label id="message">{{msg}}</label>
        </md-layout>
      </md-layout>
    </form>
    <md-card-actions>
      <md-button @click="check" class="md-icon-button md-primary md-raised">
        <md-icon>find_in_page</md-icon>
        <md-tooltip md-direction="right">Search for a user</md-tooltip>
      </md-button>
    </md-card-actions>

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
      this.msg = ''
      if (this.user) {
        this.searching = true;
        api.post('/check', {user: this.user}).then(ret => {
          this.msg = ret.data.msg;
          this.searching = false;
        }).catch(err => {
          this.msg = err.response.data.msg;
          this.searching = false;
        })
      } else {
        this.msg = 'Informe o aluno'
      }
    }
  }
};
</script>

<style scoped>
  #message {
    color: #aaa;
    font-size: 14px;
  }
</style>