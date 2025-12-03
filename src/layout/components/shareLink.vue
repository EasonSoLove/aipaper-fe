<template>
  <div>
    <!-- 页面名称 -->
    <el-dialog
      title="专属分享页"
      append-to-body
      :visible.sync="dialogVisible"
      :width="device == 'mobile' ? '80%' : '50%'"
      :before-close="handleClose"
    >
      <div class="container">
        <div class="section">
          <h2>推广文案</h2>
          <p>AI写作指导平台Mixpaper来啦！</p>
          <ul>
            <li>1、3万字内容，10分钟搞定，一键下载</li>
            <li>2、千字大纲，免费生成，在线随手编辑</li>
            <li>3、无需登录注册，加载精准，走即用即停</li>
            <li>4、邀请一人可赠送查重券(10000字以内)</li>
          </ul>
          <p>
            官网:
            <a href="https://mixpaper.cn/home/home">https://mixpaper.cn/</a>
          </p>
        </div>

        <div class="section">
          <h2>专属推广链接</h2>
          <p>
            AI论文，免费大纲，10分钟3万字 👉
            <span>
              {{ inv_code_url }}
            </span>
          </p>
          <button @click="copyLink()">点击复制</button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { inviteFetch } from "@/api/paper";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";

export default {
  name: "demo",
  data() {
    return {
      // 定义变量
      dialogVisible: false,
      inv_code_url: "",
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["device"]),
  },
  methods: {
    showInit() {
      inviteFetch().then((res) => {
        this.dialogVisible = true;
        this.inv_code_url = res.result.inv_code_url;
      });
    },
    copyLink() {
      const el = document.createElement("textarea");
      el.value = "AI论文，免费大纲，10分钟3万字 👉" + this.inv_code_url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      // alert("链接已复制到剪贴板");
      this.$message({
        type: "success",
        message: "链接已复制到剪贴板",
      });
    },
    // 定义方法
    handleClose(done) {
      done();

      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }
.container {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  .section {
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
  }

  p,
  ul {
    margin: 0 0 10px 0;
  }

  ul {
    padding-left: 20px;
  }

  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
}
</style>
