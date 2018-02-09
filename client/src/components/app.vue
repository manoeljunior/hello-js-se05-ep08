<template>
    <div id="app">
      <md-card>
        <md-card-header>
          <div class="md-title">
            Final Project - Hello.js
          </div>
          <div class="md-subhead">
            by @manoeljunior
          </div>
        </md-card-header>
        <md-card-content>
          <router-view></router-view>
        </md-card-content>
      </md-card>
    </div>  
      
</template>

<script>
const VueRouter = require("vue-router");

module.exports = {
  name: "App"
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