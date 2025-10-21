<template>
  <div id="app">
    <div v-if="isMaintenance" class="maintenance">
      <h1>网站升级中</h1>
      <p>尊敬的用户，您好！</p>
      <!-- <p>网站被攻击,程序猿紧急修复中，预计维护时间为 10 小时。</p> -->
      <p>
        因近期用户量过大,为提供更好的用户体验
        <span class="red">网站带宽升级,</span> (ಥ_ಥ) ,程序猿
        <span class="red">紧急加班</span> 中
      </p>
      <!-- <p>网站升级后, 论文及大纲生成速度提高, 网站访问更流畅!</p> -->
      <p>
        预计维护时间为
        <b class="red"> 1 </b>
        小时。 <b>2024-10-21 16:00 恢复网站</b>
      </p>
      <!-- <p>爆肝修复中, 请稍等,或联系客服</p> -->
      <p>给您带来的不便，我们深表歉意，感谢您的理解与支持！</p>
      <div
        class="imgCode"
        style="
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <div class="contentP">
          <img
            style="width: 100%; height: 100%"
            src="./assets/images/bg/1v1img.jpg"
            alt=""
          />
        </div>

        <p>如需维护期间,下载大纲,正文, 查看记录,可联系客服</p>
        <p>联系客服,获取更多资讯及优惠活动</p>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isMaintenance: false, // 设置为 true 表示网站正在维护
    };
  },
  components: {
    // webinfo,
  },
  mounted() {
    // 页面初始化
  },
  created() {
    // 初始化逻辑
  },
  beforeDestroy() {
    // 清除逻辑
  },
  computed: {
    // 计算属性
  },
  methods: {
    // 定义方法
  },
};
</script>

<style lang="scss" scoped>
.maintenance {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f7f7f7;
  color: #333;
  padding: 20px;

  h1 {
    font-size: 2.5em;
    color: #d9534f;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2em;
    margin: 10px 0;
  }
}
.contentP {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 5px;
}
.imgCode p {
  line-height: 20px;
  margin: 3px !important;
}
</style>
