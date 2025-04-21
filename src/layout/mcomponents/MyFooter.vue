<template>
  <div :class="['footer', showContent ? 'isHome' : '']">
    <!-- 网站信息 -->
    <section class="siteInfo">
      <div class="col col_1">
        <img src="@/assets/images/MIXPAPERwxxz.png" alt="" />
        <div class="linkListBox">
          <div class="linkbox" v-for="image in agent_image" :key="image.id">
            <template v-if="display_ids.includes(image.id)">
              <div class="linkImg">
                <img :src="image.image_url" :alt="image.name" />
              </div>
              <p class="linktext">{{ image.name }}</p>
            </template>
          </div>
        </div>
      </div>
      <div></div>
      <!-- sss -->
      <!-- <div class="infoBottom">
        <p class="bottomTitle">关于万象</p>
        <ul class="bottomLink">
          <li>
            <el-tooltip class="item" effect="light" placement="left">
              <template #content>
                <div
                  class="tooltipContent"
                  style="width: 400px; font-size: 14px"
                >
                  <p>
                    浅思科技
                    成立于2023年，一家专注于人工智能领域的高科技公司，一家基于大数据产品的创新型公司。我们自主开发了数据服务产品：豌豆API<br />
                    我们与合作伙伴共同开发的大模型集合搜索产品：chat all<br />
                    我们与北京某高校研究室合作共同开发产品：万象学术平台<br />
                    未来... ...
                  </p>
                </div>
              </template>
              <el-button>企业介绍</el-button>
            </el-tooltip>
          </li>
          <li>企业大事记</li>
          <li>合作机构</li>
        </ul>
      </div> -->
      <div class="infoBottom">
        <p class="bottomTitle">产品服务</p>
        <ul class="bottomLink">
          <li>
            <a
              href="http://wepu.kelisida.cn/?Q:hclickid=f56b1cedf9728afc"
              target="_blank"
              >维普</a
            >
          </li>
          <li>
            <a href="https://www.wanfangdata.com.cn/index.html" target="_blank"
              >万方</a
            >
          </li>
          <li>
            <a href="https://www.cnki.net/" target="_blank">知网</a>
          </li>
          <li>
            <a
              href="https://xueshu.baidu.com/?source=chemnav.net"
              target="_blank"
              >百度学术</a
            >
          </li>
          <li>
            <a href="https://www.termonline.cn/" target="_blank">术语在线</a>
          </li>
          <li>
            <a href="https://www.x-mol.com/" target="_blank">X-MOL</a>
          </li>
        </ul>
      </div>
    </section>
    <!-- 底部栏 -->
    <div class="footerP">
      <p style="text-align: center; color: #2e2e2e">
        <span>© 2024 石家庄浅思科技有限公司</span>
        <a href="https://beian.miit.gov.cn" target="_blank"
          >冀ICP备2024060058号-2</a
        >
      </p>
    </div>
    <!-- 悬浮菜单 --><!-- 显示条件怎么设置? -->
    <div class="floatMenuWrapper" v-if="true">
      <div class="menu">
        <!-- <el-button v-popover:popover1> -->
        <!-- <el-button @click="$devf">
          <div class="itemLi ai">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan4"></use>
            </svg>
            <p style="width: 3em">AI助手</p>
          </div>
        </el-button> -->

        <div>
          <el-popover placement="left" width="150" trigger="hover">
            <div class="qywxBox">
              <img :src="contactService.image_url" alt="" />
            </div>
            <p>扫描二维码，<br />联系售前/售后客服</p>
            <el-button slot="reference">
              <div class="itemLi">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-ai-service"></use>
                </svg>
                <p>{{ contactService.name }}</p>
              </div>
            </el-button>
          </el-popover>
        </div>
        <div>
          <!-- <el-button slot="reference" @click="$jumpUrl('/toPromotion')"> -->
          <!-- <el-button slot="reference" @click="$devf">
            <div class="itemLi">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-jiaruwomen"></use>
              </svg>
              <p>我要推广</p>
            </div>
          </el-button> -->
          <el-popover placement="left" width="150" trigger="hover">
            <div class="qywxBox">
              <img :src="reflectService.image_url" alt="" />
            </div>
            <p>扫描二维码，<br />联系加盟客服</p>
            <el-button slot="reference">
              <div class="itemLi">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-jiaruwomen"></use>
                </svg>
                <p>{{ reflectService.name }}</p>
              </div>
            </el-button>
          </el-popover>
        </div>
        <div>
          <!-- <el-button slot="reference" @click="$jumpUrl('/toPromotion')"> -->
          <!-- <el-button slot="reference" @click="$devf">
            <div class="itemLi">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-jiaruwomen"></use>
              </svg>
              <p>我要推广</p>
            </div>
          </el-button> -->
          <el-popover placement="left" width="150" trigger="hover">
            <div class="qywxBox">
              <img :src="reflectService.image_url" alt="" />
            </div>
            <p style="margin-top: 5px">微信扫描二维码，<br />查看使用文档</p>
            <el-button slot="reference">
              <div class="itemLi">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-jiaruwomen"></use>
                </svg>
                <p>使用教程</p>
              </div>
            </el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <el-popover
      ref="popover1"
      placement="left-start"
      width="125"
      trigger="click"
    >
      AI写作
    </el-popover>
    <el-popover
      ref="popover2"
      placement="left-start"
      width="125"
      trigger="click"
    >
      在线客服
    </el-popover>
    <el-popover
      ref="popover3"
      placement="left-start"
      width="125"
      trigger="click"
    >
      <div class="qrBox" title="团队二维码">
        <img class="qrcode" src="@/assets/images/wx.jpg" alt="" />
      </div>
    </el-popover>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { getHomeInfo } from "@/api/user";
import { getDomain } from "@/utils/index.js";

export default {
  name: "myFooter",
  data() {
    return {
      // 定义变量
      display_ids: [2, 3, 4], // 需要展示的image id
    };
  },
  components: {
    // webinfo,
  },
  props: {
    showContent: {
      require: true,
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  mounted() {
    // 获取首页数据
    this.$nextTick(() => {
      let data = {
        sub_domain: getDomain(),
      };
      getHomeInfo(data).then((res) => {
        this.$store.dispatch("app/setHomeData", res.result);
        this.$store.dispatch("user/setAgentImage", res.result.agent_image);
      });
    });
  },

  computed: {
    ...mapGetters(["agent_image"]),
    contactService() {
      return this.agent_image.find((image) => image.id === 5);
    },
    reflectService() {
      return this.agent_image.find((image) => image.id === 6);
    },
  },
  methods: {
    // 定义方法
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
@import "@/styles/variables.scss";

// 媒体查询
// @media only screen and (max-width: 939px) {
// }

.footer {
  padding-left: $sideBarWidth !important;
  background: #f7f7f7;
}

.footer.isHome {
  padding-left: 0px !important;

  .siteInfo {
    max-width: 1100px;
    position: relative;
    width: 100%;
    margin: 0 auto;
  }
}

.infoBottom {
}

.siteInfo {
  display: grid;
  grid-template-columns: 8fr 3fr 4fr 3fr;
  text-align: left;
  padding: 32px 0px;
  position: relative;

  .col {
    padding: 0 20px;

    p {
      font-size: 14px;
      color: #000000;
      line-height: 1.5em;
    }

    .title_mini {
      color: #666666;
      font-size: 14px;
      line-height: 3em;
    }
  }

  .col_1 {
    > img {
      height: 20px;
      width: auto;
    }

    p {
      font-size: 12px;
      font-family: "黑体";
      line-height: 2em;
    }
  }
}

.footer p {
  margin: 0px;
  cursor: default;
}

.footerP {
  background: #fff;
  padding: 24px 0;
  text-align: center;
  font-size: 12px;

  p {
    color: rgb(46, 46, 46);
    display: flex;
    width: 100%;
    padding: 0 10px;
    flex-wrap: wrap;
    justify-content: center;

    span {
      padding: 0 5px;
    }
  }
}

.floatMenuWrapper {
  position: fixed;
  bottom: 25vh;
  right: 28px;
  width: 44px;
  z-index: 9999;

  .menu {
    display: flex;
    flex-direction: column;
    gap: 8px;

    button {
      padding: 0px;
      border: none;
      background-color: transparent;
      margin: 0px !important;
    }

    .itemLi {
      &:hover {
        cursor: pointer;
      }

      width: 45px;
      height: auto;
      font-size: 12px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #cccccc;
      display: grid;
      justify-content: center;
      align-items: center;
      justify-items: center;
      padding: 3px;

      .icon {
        width: 2em;
        height: 2em;
      }

      p {
        width: 2em;
        text-wrap: wrap;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .ai {
      border: 1px solid transparent;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      background-image: linear-gradient(90deg, #fff, #fff),
        linear-gradient(135deg, rgba(0, 186, 255, 1), rgba(175, 34, 227, 1));
    }
  }
}

.qrBox {
  font-size: 0px;
  display: inline-block;
}

.qrcode {
  width: 100px;
  height: 100px;
}

.linkListBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.linkbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .linkImg {
    width: 90px;
    height: 90px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.infoBottom {
  font-size: 14px;
  line-height: 28px;

  .bottomTitle {
    font-weight: bold;
    color: #000;
  }

  .bottomLink {
    color: #333;

    ::v-deep .el-button {
      border-color: transparent;
      color: #333;
      padding: 0px;

      &.el-button:focus,
      &.el-button:hover {
        background-color: transparent;
      }
    }
  }
}

.qywxBox {
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
  }

  & + p {
    text-align: center;
  }
}
.bottomLink {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.bottomLink li {
  flex: 1 1 50%; /* Each item takes up 50% of the width to create two rows */
  margin: 5px 0; /* Add vertical spacing */
}

.bottomLink a {
  display: block;
  text-align: left; /* Align text to the left */
  text-decoration: none; /* Remove underline by default */
  color: #333;
  padding-left: 10px; /* Optional: add some padding for better alignment */
  transition: color 0.3s, text-decoration 0.3s; /* Smooth transition */
  cursor: pointer; /* Show hand cursor */
}

.bottomLink a:hover {
  color: blue; /* Change text color to blue on hover */
  text-decoration: underline; /* Add underline on hover */
}
@import "@/styles/mediaMain.scss";
</style>
