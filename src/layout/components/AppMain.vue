<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.app-main {
  /*50 = navbar  */
  // min-height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  background-color: #f7f7f7;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 80px;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
