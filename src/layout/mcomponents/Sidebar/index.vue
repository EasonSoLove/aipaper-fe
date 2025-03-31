<template>
  <div class="qysytxy" :key="timeKey">
    <div
      @click="$jumpUrl('/home/home')"
      class="grid-content nav_left flex items-center"
    >
      <div class="logo-box2">
        <!-- <div class="logoR">
          <img :src="logoMax" alt="" title="logo" />
        </div> -->
        <div class="logoL">
          <p>万象写作</p>
          <!-- <img :src="logo" alt="" title="logo" /> -->
        </div>
      </div>
    </div>
    <!-- <div @click="$jumpUrl('/home/home')" class="logoEr">
      <div class="logoSecClass">
        <img :src="logoMax" alt="" title="logo" />
      </div>
      <img src="@/assets/images/MIXPAPER.png" alt="" />
    </div> -->
    <div class="mSiderBar">
      <div
        @click="toView(0, '/home/home')"
        :active="'home' == $route.name"
        class="mItemWrapper"
      >
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content=""
          placement="right"
        > -->
        <div class="mSliderItem">
          <div class="left">
            <span class="imgIcon"></span>{{ $t("route.homePage") }}
          </div>
          <span class="right imgIcon"></span>
        </div>
        <!-- </el-tooltip> -->
      </div>
      <template v-for="(route, i) in routerList">
        <div
          :key="'route_' + i"
          v-if="!route.hidden"
          :class="['mItemWrapper', route.meta.inDevelopment ? 'gray' : '']"
          :active="route.name == $route.name"
          @click="$jumpUrl('/main/' + route.path)"
        >
          <!-- <el-tooltip
            class="item"
            effect="dark"
            :content="route.meta.describe"
            placement="right"
          > -->
          <div class="mSliderItem">
            <div class="left">
              <!-- <span class="imgIcon"></span> -->
              <span class="imgIconBg">
                <i :class="route.meta.icon"></i>
              </span>
              {{ generateTitle(route.meta.title) }}
            </div>
            <span class="right imgIcon"></span>
          </div>
          <!-- </el-tooltip> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
const _ = require("lodash");
import { generateTitle } from "@/utils/i18n";

export default {
  name: "Sidebar",
  data() {
    return {
      active: 1,
      logoMax: require("@/assets/images/logoMax.png"),
      logo: require("@/assets/images/MIXPAPER.png"),

      timeKey: null,
      fullPath: this.$route.fullPath,
      routerList: [], //展示在导航栏的菜单路由
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
      // let arr = [
      //   { name: "one", path: "/main/explore" },
      //   { name: "two", path: "/main/writepaper" },
      //   { name: "three", path: "/main" },
      // ];
      // return arr;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  watch: {
    // $route: function (to, from) {
    //   if (to.path == "/main/explore") {
    //     this.$store.dispatch("app/setActiveSidebar", 5);
    //   } else if (to.path == "/main/writepaper") {
    //     this.$store.dispatch("app/setActiveSidebar", 1);
    //   } else if (to.path == "/main/readpaper") {
    //     this.$store.dispatch("app/setActiveSidebar", 2);
    //   } else if (to.path == "/main/amendpaper") {
    //     this.$store.dispatch("app/setActiveSidebar", 3);
    //   } else if (to.path == "/main/integratedservices") {
    //     this.$store.dispatch("app/setActiveSidebar", 4);
    //   } else if (to.path == "/main/aitools") {
    //     this.$store.dispatch("app/setActiveSidebar", 6);
    //   } else if (to.path == "/main/reduceRepetition") {
    //     this.$store.dispatch("app/setActiveSidebar", 7);
    //   }
    //   this.timeKey = JSON.stringify(new Date().getMilliseconds);
    // },
  },
  mounted() {
    let arr = _.find(
      this.$router.options.routes,
      (obj) => obj.name == "main" && obj.meta.id == "5"
    );
    this.routerList = arr.children;
  },
  methods: {
    generateTitle,
    toView(index, path) {
      this.$store.dispatch("app/setActiveIndex", 0);
      this.$jumpUrl(path);
    },
  },
};
</script>
<stlyle lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.logo {
  padding: 20px 25px;
}

.sidebar-container {
  background: #f7f7f7;
  color: #000;
  font-size: 14px !important;

  .mItemWrapper {
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 12px;
    font-weight: 600;
    margin-right: 25px;

    .mSliderItem {
      border-radius: 24px;
      line-height: 24px;
      padding-left: 24px;
      padding-right: 15px;
      padding-bottom: 6px;
      padding-top: 6px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .imgIcon {
          margin-right: 10px;
        }
      }

      .imgIcon {
        display: inline-block;
        --size: 20px;
        width: var(--size);
        height: var(--size);
        background-image: url("../../../assets//images/conical-flask-darrk.png");
        background-size: 100% 100%;
      }
      .imgIconBg {
        display: inline-block;
        margin-right: 10px;
        --size: 20px;
        font-size: 20px;
        width: var(--size);
        height: var(--size);
        background-size: 100% 100%;
      }
      .right.imgIcon {
        background-image: url("../../../assets//images/caret-left-white.png");
        display: none;
      }
    }

    &.gray {
      cursor: not-allowed;
      color: #777777d5;
    }

    &:hover .mSliderItem {
      background-color: #3355ff !important;
      color: #fff;

      .imgIcon {
        background-image: url("../../../assets//images/conical-flask-white.png");
      }

      .right.imgIcon {
        background-image: url("../../../assets//images/caret-left-white.png");
        display: block;
        transform: rotateY(180deg);
      }
    }
  }

  .mItemWrapper[active="true"] {
    .mSliderItem {
      background-color: #3355ff;
      color: #fff;

      .imgIcon {
        background-image: url("../../../assets//images/conical-flask-white.png");
      }

      .right.imgIcon {
        background-image: url("../../../assets//images/caret-left-white.png");
        display: block;
        transform: rotateY(180deg);
      }
    }
  }
}

.logoEr {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    // width: 100%;
    // height: 100%;
    width: 115px;
    height: 18px;
  }
}

.grid-content {
  border-radius: 4px;

  &:hover > div {
    cursor: pointer;
  }
}

.logo-box2 {
  padding-left: 36px;
  // width: 176px;
  height: 80px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logoR {
    width: 48px;
    height: 40px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.logoL {
  width: 117px;
  height: 40px;
  font-family: DOUYINSANSBOLD, DOUYINSANSBOLD;
  font-weight: normal;
  font-size: 26px;
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    width: 117px;
    height: 19px;
  }

  p {
    width: 100%;
    font-family: arial, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
      "宋体", 宋体, Tahoma, Arial, Helvetica, STHeiti;
    text-align: center;
    font-weight: 600;
    // transform: rotateX(45deg) scaleX(1.2);
  }
}
.mSiderBar {
  padding-top: 10px;
}
</stlyle>
