<template>
  <div>
    <md-card>
      <md-card-header>
        <div class="md-title">
          Final Project - Hello.js
        </div>
        <div class="md-subhead">
          by @manoeljunior
        </div>
        <md-card-content>
          <md-layout md-gutter>
            <md-layout md-flex="50">
              <md-input-container>
                <label>Usuário</label>
                <md-input v-model="user" class="md-inline"></md-input>
              </md-input-container>  
            </md-layout>
            <md-layout>
              <md-button class="md-icon-button md-raised md-primary">
                <md-icon>check_cicle</md-icon>
              </md-button>
            </md-layout>
          </md-layout>
        </md-card-content>
      </md-card-header>
    </md-card>
  </div>
</template>

<script>
const VueRouter = require("vue-router");

module.exports = {
  name: "App",
  data () {
    return {
      user: ''
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