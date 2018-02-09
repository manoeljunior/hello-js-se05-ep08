<template>
  <div id="check-user">
    <md-layout md-gutter>
      <md-layout md-flex="50">
        <h5 class="md-title">Listagem de presença</h5>
      </md-layout>
    </md-layout>
    <md-layout md-gutter>
      <md-layout md-flex="100">
        <md-table>
          <md-table-header>
            <md-table-row>
              <md-table-head></md-table-head>
              <md-table-head>Aluno</md-table-head>
              <md-table-head v-for="index in 8" :key="index">Aula 0{{index}}</md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row v-for="(item, index) in comments" :key="index">
              <md-table-cell>
                <md-avatar>
                  <img :src="item.avatar" alt="Avatar">
                </md-avatar>
              </md-table-cell>
              <md-table-cell>
                {{item.user}}
              </md-table-cell>

              <template v-for="idx in 8">
                <md-table-cell v-if="item.comments['SE05EP0'+idx]"><i class="material-icons green">mood</i></md-table-cell>
                <md-table-cell v-else="item.comments['SE05EP0'+idx]"><i class="material-icons red">highlight_off</i></md-table-cell>
              </template>
            </md-table-row>
          </md-table-body>
        
        </md-table>
      </md-layout>
    </md-layout>
  </div>  
</template>

<script>
const axios = require("axios");
const api = axios.create({
  baseURL: "http://localhost:3000"
});

module.exports = {
  name: "list-users",
  data () {
    return {
      comments: [ ]
    }
  },
  created() {
    api.get('/listall').then(ret => {
      this.comments = ret.data
    }).catch(err => {
      console.log(err);
      alert("Erro ao recuperar festas");
    })
  }
};
</script>

<style scoped>
  .green {
    color: darkgreen;
  }

  .red {
    color: darkred;
  }
</style>