<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div style="text-decoration: underline">点击切换</div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
      <!-- <el-dropdown-item :disabled="language === 'es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'ja'" command="ja">
        日本語
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      this.$message({
        message: "Switch Language Success",
        type: "success",
      });
    },
  },
};
</script>
