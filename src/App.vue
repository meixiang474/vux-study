<template>
  <div id="app">
    珠峰的年龄 {{ age }}
    <br />
    我的年龄: {{ $store.getters.getAge }}
    <br />
    <button @click="$store.state.age += 10"></button>
    <button @click="changeAge(5)">同步更新状态</button>

    <button @click="$store.dispatch('changeAge', 5)">异步更新状态</button>
    {{ $store.state.a.c }}
    {{ $store.state.b.d }}
    {{ $store.getters.getD }}
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "./vuex";

export default {
  computed: {
    ...mapState(["age"]),
    // age(){
    //   return this.$store.state.age
    // }
    ...mapGetters(["getAge"]),
  },
  methods: {
    ...mapMutations(["changeAge"]),
    // changeAge(payload){
    //   this.$store.commit('changeAge',payload)
    // }
  },
  mounted() {},
};
</script>
