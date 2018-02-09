const router = {
  routes: [
    { path: "/", component: require("./components/check-user.vue") },
    { path: "/check-user", component: require("./components/check-user.vue") },
    { path: "/list-users", component: require("./components/list-users.vue") }
  ]
}

module.exports = router