<template>
    <div id="app">
      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">
              Final Project - Hello.js
            </div>
            <div class="md-subhead">
              by @manoeljunior
            </div>
          </md-card-header-text>
          <md-card-menu>
            <md-button @click="checkUser" class="md-icon-button">
              <md-icon>person_add</md-icon>
            </md-button>
            <md-button @click="listUsers" class="md-icon-button">
              <md-icon>playlist_add_check</md-icon>
            </md-button>
          </md-card-menu>
        </md-card-header>
        <md-card-content>
          <transition name="bounce" mode="out-in">
            <router-view></router-view>
          </transition>
        </md-card-content>
      </md-card>
    </div>  
      
</template>

<script>
const VueRouter = require("vue-router");

module.exports = {
  name: "App",
  methods: {
    checkUser() {
      this.$router.push('/check-user')
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

  .bounce-enter-active,
  .bounce-leave-active {
    transition: all 0.4s;
  }

  .bounce-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .bounce-enter {
    transform: translateX(-100%);
  }

</style>