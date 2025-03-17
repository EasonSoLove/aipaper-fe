<template>
  <div v-loading="loading" class="container">
    <header class="header footer">
      <el-button type="primary" @click="getkeyWords" round style="width: 100%"
        >生成检索关键词</el-button
      >
    </header>
    <div class="keywordBox">
      <div class="keyLeft">
        <p style="font-size: 14px; font-weight: bold">
          中文关键词
          <span style="font-size: 10px; margin-left: 8px; color: #606266"
            >关键词上限4个,可删除后自定义关键词</span
          >
        </p>
        <ul>
          <li
            v-for="(keyword, index) in keyWordsData.search_cn_keywords"
            :key="index"
          >
            {{ keyword }}
            <el-button
              @click="removeKeyword('cn', index)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </li>
        </ul>
        <div class="keyBottom">
          <el-input
            placeholder="关键词上限4个,可删除后自定义关键词"
            v-model="newCnKeyword"
            @keyup.enter="addKeyword('cn')"
            :disabled="keyWordsData.search_cn_keywords.length >= 4"
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="addKeyword('cn')"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-input>
        </div>
      </div>
      <div class="keyRight">
        <p style="font-size: 14px; font-weight: bold">
          英文关键词
          <span style="font-size: 10px; margin-left: 8px; color: #606266"
            >关键词上限4个,可删除后自定义关键词</span
          >
        </p>
        <ul>
          <li
            v-for="(keyword, index) in keyWordsData.search_en_keywords"
            :key="index"
          >
            {{ keyword }}
            <el-button
              @click="removeKeyword('en', index)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </li>
        </ul>
        <div class="keyBottom">
          <el-input
            placeholder="关键词上限4个,可删除后自定义关键词"
            v-model="newEnKeyword"
            @keyup.enter="addKeyword('en')"
            :disabled="keyWordsData.search_en_keywords.length >= 4"
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="addKeyword('en')"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-input>
        </div>
      </div>
    </div>
    <div>
      <div class="button-group">
        <el-button
          type="primary"
          @click="seachPaperS"
          round
          style="width: 100%"
        >
          根据关键词, 检索文献
        </el-button>
      </div>
      <div class="content">
        <div class="sidebar">
          <h3>用户上传文献列表</h3>
          <div
            class="sidebar-item"
            v-for="(paper, index) in user_upload_paper_fe_lists"
            :key="`ref-${index}`"
            :class="paper.is_relevant === 'yes' ? 'selected-item' : ''"
          >
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="success"
                  size="mini"
                  :plain="paper.is_relevant !== 'yes'"
                  @click="togglePaperSelection(paper)"
                >
                  {{ paper.is_relevant === "yes" ? "已选中" : "选择" }}
                </el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span
                  class="toggle-button"
                  @click="paper.isExpanded = !paper.isExpanded"
                >
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>
                  作者: <span>{{ paper.authors.join(", ") }}</span>
                </p>
                <p class="dateP">
                  日期: <span>{{ paper.date }}</span>
                </p>
              </div>
            </div>
          </div>
          <hr />
          <h3>系统检索文献列表</h3>

          <div
            class="sidebar-item"
            v-for="(paper, index) in reference_paper_fe_lists"
            :key="`ref-${index}`"
            :class="paper.is_relevant === 'yes' ? 'selected-item' : ''"
          >
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="success"
                  size="mini"
                  :plain="paper.is_relevant !== 'yes'"
                  @click="togglePaperSelection(paper)"
                >
                  {{ paper.is_relevant === "yes" ? "已选中" : "选择" }}
                </el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span
                  class="toggle-button"
                  @click="paper.isExpanded = !paper.isExpanded"
                >
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>
                  作者: <span>{{ paper.authors.join(", ") }}</span>
                </p>
                <p class="dateP">
                  日期: <span>{{ paper.date }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="content-main">
          <h3>已选中的论文</h3>
          <div v-for="(paper, index) in selectedPapers" :key="index">
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="danger"
                  size="mini"
                  @click="delSelectPaper(paper)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span
                  class="toggle-button"
                  @click="paper.isExpanded = !paper.isExpanded"
                >
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>作者: {{ paper.authors.join(", ") }}</p>
                <p>日期: {{ paper.date }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="upload-section">
          <div class="upload-box">
            <el-upload
              class="upload-demo"
              style="width: 100%"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  generate_keywords,
  save_papers_list,
  save_keywords,
  search_papers,
} from "@/api/paper";
export default {
  name: "DocumentManager",
  data() {
    return {
      // isMenuOpen: true, // 控制整个内容区显示状态
      keyWordsData: {
        search_cn_keywords: [],
        search_en_keywords: [],
      },
      loading: false,
      newCnKeyword: "",
      activeCollapse: "", // 当前展开的折叠面板
      newEnKeyword: "",
      reference_paper_fe_lists: [
        {
          title: "从古印度宗教观念的发展看理性和信仰的关系",
          authors: ["方瑾", "麻天祥"],
          source: "湖北社会科学",
          date: "2007-01-10",
          database: "期刊",
          isExpanded: false,
          abstract:
            "人类的一切文明几乎无一例外地都有着追寻终极无限、力图超越现象之有限的丰富内容,宗教哲学是这种追寻的集中体现。古印度宗教文明的发展,正是古代雅利安人从《吠陀》时代起,经过《奥义书》时代再到佛教时代,追求终极无限的结果。信仰和理性是推进印度宗教终极观念演进的两大工具,人们的理性思考随着时间的推移越来越完备,佛教的产生不仅是这种理性思考发展的顶峰,同时,还最终完成了对理性与信仰二者的超越。佛教的这种哲学方法对现今困境多多的主流文明无疑可提供重大的借鉴。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title:
            "交流互鉴  共促发展  国家宗教事务局代表团访问印度、尼泊尔和泰国",
          authors: ["张剑"],
          source: "中国宗教",
          date: "2015-04-20",
          isExpanded: false,
          database: "期刊",
          abstract:
            '\u003c正\u003e应印度文化部、尼泊尔文化、旅游和民航部、"世界佛教徒联谊会"的邀请,4月1日至10日,国家宗教事务局局长王作安率代表团对印度、尼泊尔、泰国进行了友好访问。4月1日,代表团会见了印度文化部长谢利帕德·耶索·纳伊克,就佛教文物保护、共同开发玄奘法师遗迹交换了意见。4月5日,代表团拜会了尼泊尔总统拉姆·巴兰·亚达夫,会见了尼泊尔文化、旅游和民航部长迪帕克·昌德拉·阿玛特亚。双方表示,中尼是友谊加法谊的双重友情。今年是中尼建交60周年,双方将共同致力',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "拉杰普特时代印度宗教的发展与变化",
          authors: ["庄万友"],
          source: "华中师范大学学报(哲学社会科学版)",
          isExpanded: false,
          date: "1993-10-28",
          database: "期刊",
          abstract:
            "\u003c正\u003e 拉杰普特一词,源于梵语的rajan和putra,意思是“王子”。7世纪中叶,一度统一过北印度的戒日帝国解体后,北印度各地独立的王公多以“王子”或“王孙贵族”自居,相互混战,割据称雄,导致大部分地区的分裂局面一直延续到13世纪初。许多史家因此而将北印度历史上这段政治分裂的时期称为“拉杰普特时代”。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "论印度宗教对印度哲学思想形成发展的独特作用",
          authors: ["唐绍宏"],
          isExpanded: false,
          source: "南亚研究季刊",
          date: "1992-07-01",
          database: "期刊",
          abstract:
            "\u003c正\u003e “宗教很可以不要哲学,而哲学却不可没有宗教”。黑格尔的这句名言特别适合于印度哲学。哲学之受宗教影响,在东西方的思想发展史上屡见不鲜,而在印度表现尤甚。有的学者干脆称印度哲学为“宗教的哲学”或“哲学的宗教”。印度著名哲学家德·恰托巴底亚耶指出:“我们的哲学思想没有能从一切宗教迷信、神话想象、甚至对于典礼仪式的信仰中完全解放出来”。“宗教与哲学没有完全分离”。事实正是如此。印度哲学确有区别于西方哲",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "中国的印度宗教文化研究:发展与前景——邱永辉教授访谈录",
          authors: ["李丽"],
          source: "东南亚南亚研究",
          date: "2012-12-20",
          database: "期刊",
          abstract:
            '\u003c正\u003e邱永辉:中国社会科学院世界宗教所研究员,当代宗教研究室主任,博士生导师,中国社会科学院"创新工程"项目"当代宗教发展态势研究"首席研究员。曾就学于四川大学、中国社会科学院研究生院、英国',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "宗教化、制度化与本土化:印度尼西亚孔教的百年发展",
          authors: ["王爱平"],
          source: "儒教研究",
          date: "2009-06-15",
          database: "辑刊",
          abstract:
            '源于中国儒教的印尼孔教自1900年第一个正式组织成立之时,就明确了其宗教性质,确立了基本教义,并逐步具备了"制度化宗教"的基本要素。印尼独立后,在现代民族国家的框架下,印尼孔教历经磨难,终于发展成为一个比较成熟、完备的"制度化宗教",成为印尼六大合法宗教之一。印尼孔教的百年发展史,是制度化建设的过程;也是源于中国的儒教宗教化、印尼化的过程;反映出一部分土生华人的文化认同和华人身份认同;也显示出中国儒学传统超越特定历史时空的顽强生命力。',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度的宗教文化观、政治渐进主义和经济发展(续)",
          authors: ["弗朗辛·R·弗兰克尔", "施尧伯", "凌静"],
          source: "南亚研究",
          date: "1982-07-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 一计划方针未能克服经济上的双重现象,这一点怎么解释呢?许多发展中国家都具有这种特点,我们可以举出一个明显的理由来说明这一特点。印度的人口在本世纪上半叶以每年大约1％的增长率增加了50％以上,在这以后的二十五年中则几乎翻了一番,达到每年增长2.5％的最高记录,而且一直保持着这一增长水平。总的说来,目前印度的人口比它的经济计划制订者们所能预计的要多出几乎1.5亿。此外,重工业或资本密集型工业能以少数劳动力达到很高的生产率,这就阻碍了就业机会的逐步扩大,而要吸收农村的大量失业人口,逐步扩大就业机会是必要的。这一趋势未受",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "谈宗教对现代印度发展产生的消极影响",
          authors: ["王晶岩"],
          source: "辽宁师专学报(社会科学版)",
          date: "1999-10-15",
          database: "期刊",
          abstract:
            "本文从妇女地位、宗教冲突、人口问题及社会的保守性等几个方面论述了宗教对现代印度社会产生的消极影响，由于印度人笃信宗教，致使印度的进步势力同宗教势力的斗争是长期的和艰巨的。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度宗教与社会经济发展的关系",
          authors: ["吴永年"],
          source: "南亚研究",
          date: "2008-12-15",
          database: "期刊",
          abstract:
            "印度社会的发展往往与宗教变革相关。印度历史上主要经历了四次大的宗教变革运动,而每次宗教变革都推动了印度社会的发展。今天,印度经济的崛起无疑也与宗教有着密不可分的多方面的联系。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度宗教哲学的发展线索与重要特点",
          authors: ["姚卫群"],
          source: "南亚研究",
          date: "2003-06-30",
          database: "期刊",
          abstract:
            "了解印度文化与文明的关键在于理解其源远流长的宗教哲学。本文梳理了印度宗教哲学的发展脉络并对其重要特点提出了看法。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古印度宗教文化的发展变化对我们的启示",
          authors: ["张世霞"],
          source: "山西青年",
          date: "2019-04-15",
          database: "特色期刊",
          abstract:
            '古代印度的法律带有浓厚的宗教色彩,宗教信仰的根深蒂固性成就了古印度宗教文化的法典化。婆罗门教、佛教和印度教各自以不同的文化教义改写古印度社会的变迁。本文主要分析古印度宗教文化的更替对当时印度法律及社会的影响,启示人们,信仰的力量能成就智者的梦想,而当今中国的依法治国新理念,正是中国传统文化传承的精髓。"一带一路"建设,正是站在上帝的视角,禀赋给世界了解中国的路径、方法和平台。告诫人们,文化安全是牢固民族根基、事关国运兴衰的擎天柱。',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度的宗教文化观、政治渐进主义和经济发展",
          authors: ["弗朗辛·R·弗兰克尔", "施尧伯", "凌静"],
          source: "南亚研究",
          date: "1982-04-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 印度的实验既引起了人道主义者的兴趣,也引起了社会科学家的兴趣。也许任何一个发展中国家的政治领导人都没有如此长期地辩论过这样一个问题:怎么能够既获得现代化带来的经济成果,而又不损害传统社会结构的宗教文化基础?几乎从1921年圣雄甘地开始领导印度的民族运动时起,人们就怀疑是否能够说争取独立的目的仅仅是为了政治自由和经济发",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度宗教关系的发展特点及若干启示",
          authors: ["姚卫群"],
          source: "世界宗教文化",
          date: "2010-04-15",
          database: "期刊",
          abstract:
            "印度宗教在世界宗教中占有重要地位,在古代也对中国文化有过较大影响。印度宗教最初发源于印度河文明,但对后世影响较大的是吠陀与奥义书时期的宗教形态。在印度历史上,影响较大的宗教派别是婆罗门教及主要由其演化出来的印度教。佛教、耆那教、伊斯兰教、锡克教等宗教在印度历史上也起了重要作用。印度近现代的政治冲突与此地区的宗教对立及民族矛盾有着直接的关系。当代中国在建设和谐社会的过程中,应借鉴印度宗教发展过程中的一些重要经验与教训,为世界和平与人类进步做出贡献。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "浅析古印度瑜伽法的发展及其与宗教的关系",
          authors: ["冯云"],
          source: "青春岁月",
          date: "2013-11-08",
          database: "特色期刊",
          abstract:
            '瑜伽法源自于古印度,它是将类似于古文书中的教法与日常的行为方式融合起来,并使信仰充分地渗透,以此支配人的灵性修养、道德操行、生活实践来追逐身心与灵魂的和谐一体,同时激发体内潜能的体系。古印度人相信天与人的合一,瑜伽体式中把古老的技巧与合理的膳食相结合,妄图改善人们的道德与身体素质寻得长寿的奥秘。印度《奥义书》曾告诫世人:"一把剑的锋刃很不容易越过。"所以智者说:"解脱之道是艰巨的。"瑜伽法在传播过程中,融汇了信徒对身心改善的期许。鉴于东学西渐之风日盛,印度瑜伽的东传以及其在世界范围内的影响,使我们把研究视角对准了古印度文明时期,在此我们对《薄伽梵歌》中关于瑜伽法的发展及其思想作一个初步的把握,以期探讨瑜伽法与古代印度宗教的关系。',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "两年来我国印度宗教哲学研究的回顾",
          authors: ["方广锠"],
          source: "南亚研究",
          date: "1989-04-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 1987、1988两年,我国的印度宗教哲学研究在前几年研究的基础上有了较为迅速的发展。老专家硕果累累;中青年研究者正在成长,取得了不少新成果。在研究方法,研究领域方面也有新的突破。学风也更加扎实,研究水平不断提高,出现一片喜人的景象。上述种种反映我国印度宗教哲学研究正在蓬勃发展,有着广阔的前景。现简述如下。一、传统研究领域不断取得新的成果",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "零是数学难题还是哲学难题?——从古代印度宗教哲学看零的出现",
          authors: ["张小雪"],
          source: "自然辩证法研究",
          date: "2015-09-18",
          database: "期刊",
          abstract:
            "纵观整个人类文明史的发展,我们可以清晰看到,远古时代的埃及、巴比伦、中国以及印度对人类早期数学作出的巨大贡献。值得一提的是,虽然这些古国地处不同疆域,拥有各自文化,但它们关于零在早期数学发展中的地位和意义却都拥有着各自独到的历史渊源。以古印度宗教哲学为视角,通过对古印度宗教哲学的深入认识来分析零产生的思想本源和实践价值,并在数学与哲学相交融的过程中得出对零的思考启示的重新认识。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教哲学中的伦理观念",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2004-10-25",
          database: "期刊",
          abstract:
            "印度古代的宗教伦理是东方文化中的重要组成部分。印度思想史上的主要宗教哲学派别婆罗门教、佛教、耆那教、顺世论等都提出了伦理思想方面的明确观念。在这些观念中,禁欲和出世等内容占有相当比重,但与这些伦理观念不同的观念也在印度历史上起了重要的作用。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古代印度的宗教哲学妨碍了历史学的建立",
          authors: ["葛维钧"],
          source: "南亚研究",
          date: "1991-04-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 在拙文《古代印度原应是有历史的》里面,我曾说古代的印度本来是可能有史家和历史著作的,然而却终于没有。其中的原因尽管会有多种,但最根本的,我以为,是在印度独特的宗教哲学指导下形成的印度人,尤其是印度知识分子的世界观和人生观,以及他们的思想方法和生活方式所发生的影响。这些影响起了多重的阻碍作用。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教哲学",
          authors: ["孙晶"],
          source: "“理性、信仰与宗教”全国学术研讨会论文集",
          date: "2006-08-01",
          database: "中国会议",
          abstract:
            "\u003c正\u003e序言历史古貌关于印度最古老的文献《梨俱吠陀》的作成和编篡,学界一般认为是在公元前1200年左右。到公元前500年左右,作为婆罗门教的根本经典的吠陀圣典即已成形,成为印度一切思想的最权威的理论基础。从公元前500年到公元120年,反吠陀的自由思潮出现,佛教成为那个时代宗教和思想界的领军。吠陀文化的总结构出现了裂痕,婆罗门教加速了本土化和民间化,开始向印度教过渡。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古代印度的宗教哲学妨碍了历史学的建立(续)",
          authors: ["葛维钧"],
          source: "南亚研究",
          date: "1991-07-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 4、人生四要和四期人,包括古代印度的哲学家们在内,都是生活在丰富多采的物质世界中的,受着七情六欲的支配。谁都知道:所有那些世界虚无、人生如寄的理论,均是尚待证明的假设,而物质世界和社会生活的存在却是无法回避的现实。印度教本着现实态度,为其信徒设计了人生四要和四期的生活规范。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "论古印度宗教哲学的神与根本实体",
          authors: ["姚卫群"],
          source: "中国高校社会科学",
          date: "2016-07-10",
          database: "期刊",
          abstract:
            "古印度宗教与哲学有密切的关系,其主要思想派别经常将世间事物或人生现象的根本实体与神联系起来论述。此类理论的最初形成与吠陀奥义书中的一些观念有渊源关系,而在后来的发展中,各主要流派在这方面的观念进一步丰富或成型,成为古印度影响极大的理论。研究这些思想并加以客观评述,对我们认识古代东方文化的重要特色有积极意义。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度文化的哲学关照——以文化哲学研究范式为基点",
          authors: ["姜玉洪", "李晓航"],
          source: "北方论丛",
          date: "2007-03-15",
          database: "期刊",
          abstract:
            "文化是历史地凝结成的稳定的生存方式,总代表着特定时代、特定民族、特定地域中占主导地位的生存模式。印度文化是独特的宗教文化,具有强烈的宗教性、深刻的内省性、极大的包容性,印度的宗教和哲学密不可分,宗教哲学是印度文化的灵魂。印度文化是印度人的生存方式,是印度在社会发展和人类进步的现代化进程中的内在运行机制。文化哲学研究范式将使印度文化的研究更全面、更深刻。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度的“宗教哲学”与“因明学”",
          authors: ["史继忠"],
          source: "贵州文史丛刊",
          date: "2003-01-30",
          database: "期刊",
          abstract:
            "世界上有三大哲学体系 ,即希腊的“自然哲学” ,中国的“社会哲学”和印度的“宗教哲学”。在印度的“战国”与孔雀王朝时期 ,思想极其活跃 ,婆罗门教出现了“正统六家” ,沙门思潮中也出现了“顺世论”等六大家 ,并产生了佛教和嗜那教 ,以后佛教中又分化出大乘、小乘和密宗。与宗教哲学相适应的逻辑学谓之“因明学” ,在思维模式上有别于希腊的“逻辑”和中国的“名辩之学”。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "《吉檀迦利》与印度传统宗教哲学的精神同一",
          authors: ["王燕"],
          source: "南亚研究",
          date: "1991-07-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 罗宾德拉纳特·泰戈尔以其多方面的创造性活动开拓了印度近代文化史上一系列艺术门类之先端,然而,他首先是位诗人。作为第一位荣获诺贝尔文学奖的亚洲人,他将世人的文学视野引向了东方,宗教抒情诗集《吉檀迦利》的成功,不仅为他赢得了世界性殊荣,古老的印度文化也得以更加广泛地播扬。《吉檀迦利》(1910)共收入英译散文诗103首,这部被精选出来献给诗人理想之神的抒情诗集,汇粹着泰戈尔对人生真谛的执着求索和对社会问题的理性沉思,作为诗人思想艺术成熟发展的标识,《吉檀迦利》一向被推为奏出了泰戈尔艺术乐章最佳旋律的巅峰之作。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度宗教哲学的发展线索与重要特点",
          authors: ["姚卫群"],
          source: "南亚研究",
          date: "2003-06-30",
          database: "期刊",
          abstract:
            "了解印度文化与文明的关键在于理解其源远流长的宗教哲学。本文梳理了印度宗教哲学的发展脉络并对其重要特点提出了看法。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度前期吠陀经典中的宗教哲学和美学思想",
          authors: ["嘉川"],
          source: "东方丛刊（1995年第2辑 总第十二辑）",
          date: "1995-06-01",
          database: "中国会议",
          abstract:
            '\u003c正\u003e吠陀是梵文Veda的音译,含义为"明"(知识)。吠陀经是印度雅利安人最初从中亚细亚高原迁徙到印度河上游五河地区时期所产生的宗教诗歌体文献的总集。印度历史上把吠陀经所产生的时代称做吠陀时代,时间大约是公元前1500年至前1000年之间的五六百年间。吠陀经是印度遗传下来最古老的作品,也是人类现存最早的原始典籍之一。它由四部经典组成:《梨俱吠陀》(意',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "后期象征主义诗歌中的拯救话语和印度宗教哲学",
          authors: ["北塔"],
          source: "外国文学",
          date: "2010-11-28",
          database: "期刊",
          abstract:
            '几乎所有后期象征主义文学家都认为人类的信仰出现了危机,西方世界需要新的拯救,他们曾祈望基督再度降临,但基督教内部的自我拯救希望越来越渺茫。尼采号召以艺术代宗教,填补信仰的空缺,实现信仰的转换,瓦雷里、叶芝和里尔克等响应过这一号召。但艺术作为一种准宗教,它的救赎力量毕竟有限。有些人开始转而关注印度宗教尤其是佛祖信仰,"二战"几乎使他们对基督教的希望变为绝望,也使他们更多地关注佛教的拯救效果。然而,对佛教的寄托能真正挽救人类信仰的倾覆与溃败吗?艾略特也许很快就怀疑并清醒了,所以离不了宗教的他最终选择的是英国国教,而不是佛教。但他的伟大在于把佛教糅入了基督教,从而产生了某种宗教的合力。',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教哲学中展示的思维方式",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2003-10-25",
          database: "期刊",
          abstract:
            "不同国家或地区的哲学史有着自身的特点,而思维方式的差别往往是这种特点的典型表现或集中体现。古代印度哲学的发展在很大程度上是宗教思想体系的发展。现通过对佛教、婆罗门教等的宗教哲学思想体系的考察,就这些体系中展示的思维方式的主要类别、表现形态和基本特色等进行总体分析和评述。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度文化的宗教性与印度宗教哲学——读《印度宗教哲学概论》",
          authors: ["朱明忠"],
          source: "中国图书评论",
          date: "2007-06-10",
          database: "期刊",
          abstract:
            "\u003c正\u003e《印度宗教哲学概论》从一种全新的视角、以丰富的文献资料系统地阐述了印度哲学的起源、发展过程和主要宗教哲学流派,比较分析了各派别之间在一些基本问题上的不同观点和差异,并且提出了一些独到的见解。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "修炼心智:印度宗教哲学的精神",
          authors: ["孙晶"],
          source: "百科知识",
          date: "1997-06-15",
          database: "特色期刊",
          abstract:
            "\u003c正\u003e 印度是一个宗教大国,从整体上讲,印度的精神发展史同宗教发展史是平行的,这是从时间发展上纵向地来看。实际上,一个全民皆教的国家很难说哪种思想属于或不属于宗教思想。宗教在本质上就是体验最终的“实在”,或是与最终“实在”的真正的结合。为了这种体",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古印度宗教哲学中的实有与空无观念",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2006-09-30",
          database: "期刊",
          abstract:
            "实有和空无观念是印度思想史上讨论的核心或基本观念,印度远古的宗教历史文献吠陀和奥义书中就对此有表述,婆罗门教和佛教中也有大量相关论述。探讨这方面的问题对把握印度宗教哲学的主要内容、理解东方文化的基本精神有重要意义。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教哲学中的伦理观念",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2004-10-25",
          database: "期刊",
          abstract:
            "印度古代的宗教伦理是东方文化中的重要组成部分。印度思想史上的主要宗教哲学派别婆罗门教、佛教、耆那教、顺世论等都提出了伦理思想方面的明确观念。在这些观念中,禁欲和出世等内容占有相当比重,但与这些伦理观念不同的观念也在印度历史上起了重要的作用。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度前期吠陀经典中的宗教哲学和美学思想",
          authors: ["嘉川"],
          source: "东方丛刊（1995年第2辑 总第十二辑）",
          date: "1995-06-01",
          database: "中国会议",
          abstract:
            '\u003c正\u003e吠陀是梵文Veda的音译,含义为"明"(知识)。吠陀经是印度雅利安人最初从中亚细亚高原迁徙到印度河上游五河地区时期所产生的宗教诗歌体文献的总集。印度历史上把吠陀经所产生的时代称做吠陀时代,时间大约是公元前1500年至前1000年之间的五六百年间。吠陀经是印度遗传下来最古老的作品,也是人类现存最早的原始典籍之一。它由四部经典组成:《梨俱吠陀》(意',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "零是数学难题还是哲学难题?——从古代印度宗教哲学看零的出现",
          authors: ["张小雪"],
          source: "自然辩证法研究",
          date: "2015-09-18",
          database: "期刊",
          abstract:
            "纵观整个人类文明史的发展,我们可以清晰看到,远古时代的埃及、巴比伦、中国以及印度对人类早期数学作出的巨大贡献。值得一提的是,虽然这些古国地处不同疆域,拥有各自文化,但它们关于零在早期数学发展中的地位和意义却都拥有着各自独到的历史渊源。以古印度宗教哲学为视角,通过对古印度宗教哲学的深入认识来分析零产生的思想本源和实践价值,并在数学与哲学相交融的过程中得出对零的思考启示的重新认识。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古代印度的宗教哲学妨碍了历史学的建立(续)",
          authors: ["葛维钧"],
          source: "南亚研究",
          date: "1991-07-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 4、人生四要和四期人,包括古代印度的哲学家们在内,都是生活在丰富多采的物质世界中的,受着七情六欲的支配。谁都知道:所有那些世界虚无、人生如寄的理论,均是尚待证明的假设,而物质世界和社会生活的存在却是无法回避的现实。印度教本着现实态度,为其信徒设计了人生四要和四期的生活规范。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度宗教哲学的发展线索与重要特点",
          authors: ["姚卫群"],
          source: "南亚研究",
          date: "2003-06-30",
          database: "期刊",
          abstract:
            "了解印度文化与文明的关键在于理解其源远流长的宗教哲学。本文梳理了印度宗教哲学的发展脉络并对其重要特点提出了看法。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教中的神的观念",
          authors: ["姚卫群"],
          source: "宗教学研究",
          date: "2004-12-30",
          database: "期刊",
          abstract:
            "本文对印度古代哲学中的神的观念进行了专门研究。作者对印度最早的宗教历史文献———吠陀中的神的观念的主要形态进行了描述,对印度社会中影响最大的婆罗门教(印度教)的神的观念进行了探讨,并对神在印度宗教哲学中的地位进行了分析。认为印度的宗教在东方文化中占有显要的地位,而古代印度人的神的观念又是其宗教理论中的基本内容",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度的“宗教哲学”与“因明学”",
          authors: ["史继忠"],
          source: "贵州文史丛刊",
          date: "2003-01-30",
          database: "期刊",
          abstract:
            "世界上有三大哲学体系 ,即希腊的“自然哲学” ,中国的“社会哲学”和印度的“宗教哲学”。在印度的“战国”与孔雀王朝时期 ,思想极其活跃 ,婆罗门教出现了“正统六家” ,沙门思潮中也出现了“顺世论”等六大家 ,并产生了佛教和嗜那教 ,以后佛教中又分化出大乘、小乘和密宗。与宗教哲学相适应的逻辑学谓之“因明学” ,在思维模式上有别于希腊的“逻辑”和中国的“名辩之学”。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古印度宗教哲学中的实有与空无观念",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2006-09-30",
          database: "期刊",
          abstract:
            "实有和空无观念是印度思想史上讨论的核心或基本观念,印度远古的宗教历史文献吠陀和奥义书中就对此有表述,婆罗门教和佛教中也有大量相关论述。探讨这方面的问题对把握印度宗教哲学的主要内容、理解东方文化的基本精神有重要意义。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "古代印度的宗教哲学妨碍了历史学的建立",
          authors: ["葛维钧"],
          source: "南亚研究",
          date: "1991-04-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 在拙文《古代印度原应是有历史的》里面,我曾说古代的印度本来是可能有史家和历史著作的,然而却终于没有。其中的原因尽管会有多种,但最根本的,我以为,是在印度独特的宗教哲学指导下形成的印度人,尤其是印度知识分子的世界观和人生观,以及他们的思想方法和生活方式所发生的影响。这些影响起了多重的阻碍作用。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度古代宗教哲学中展示的思维方式",
          authors: ["姚卫群"],
          source: "杭州师范学院学报(社会科学版)",
          date: "2003-10-25",
          database: "期刊",
          abstract:
            "不同国家或地区的哲学史有着自身的特点,而思维方式的差别往往是这种特点的典型表现或集中体现。古代印度哲学的发展在很大程度上是宗教思想体系的发展。现通过对佛教、婆罗门教等的宗教哲学思想体系的考察,就这些体系中展示的思维方式的主要类别、表现形态和基本特色等进行总体分析和评述。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "印度文化的宗教性与印度宗教哲学——读《印度宗教哲学概论》",
          authors: ["朱明忠"],
          source: "中国图书评论",
          date: "2007-06-10",
          database: "期刊",
          abstract:
            "\u003c正\u003e《印度宗教哲学概论》从一种全新的视角、以丰富的文献资料系统地阐述了印度哲学的起源、发展过程和主要宗教哲学流派,比较分析了各派别之间在一些基本问题上的不同观点和差异,并且提出了一些独到的见解。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "后期象征主义诗歌中的拯救话语和印度宗教哲学",
          authors: ["北塔"],
          source: "外国文学",
          date: "2010-11-28",
          database: "期刊",
          abstract:
            '几乎所有后期象征主义文学家都认为人类的信仰出现了危机,西方世界需要新的拯救,他们曾祈望基督再度降临,但基督教内部的自我拯救希望越来越渺茫。尼采号召以艺术代宗教,填补信仰的空缺,实现信仰的转换,瓦雷里、叶芝和里尔克等响应过这一号召。但艺术作为一种准宗教,它的救赎力量毕竟有限。有些人开始转而关注印度宗教尤其是佛祖信仰,"二战"几乎使他们对基督教的希望变为绝望,也使他们更多地关注佛教的拯救效果。然而,对佛教的寄托能真正挽救人类信仰的倾覆与溃败吗?艾略特也许很快就怀疑并清醒了,所以离不了宗教的他最终选择的是英国国教,而不是佛教。但他的伟大在于把佛教糅入了基督教,从而产生了某种宗教的合力。',
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "论古印度宗教哲学的神与根本实体",
          authors: ["姚卫群"],
          source: "中国高校社会科学",
          date: "2016-07-10",
          database: "期刊",
          abstract:
            "古印度宗教与哲学有密切的关系,其主要思想派别经常将世间事物或人生现象的根本实体与神联系起来论述。此类理论的最初形成与吠陀奥义书中的一些观念有渊源关系,而在后来的发展中,各主要流派在这方面的观念进一步丰富或成型,成为古印度影响极大的理论。研究这些思想并加以客观评述,对我们认识古代东方文化的重要特色有积极意义。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "两年来我国印度宗教哲学研究的回顾",
          authors: ["方广锠"],
          source: "南亚研究",
          date: "1989-04-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 1987、1988两年,我国的印度宗教哲学研究在前几年研究的基础上有了较为迅速的发展。老专家硕果累累;中青年研究者正在成长,取得了不少新成果。在研究方法,研究领域方面也有新的突破。学风也更加扎实,研究水平不断提高,出现一片喜人的景象。上述种种反映我国印度宗教哲学研究正在蓬勃发展,有着广阔的前景。现简述如下。一、传统研究领域不断取得新的成果",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "《吉檀迦利》与印度传统宗教哲学的精神同一",
          authors: ["王燕"],
          source: "南亚研究",
          date: "1991-07-02",
          database: "期刊",
          abstract:
            "\u003c正\u003e 罗宾德拉纳特·泰戈尔以其多方面的创造性活动开拓了印度近代文化史上一系列艺术门类之先端,然而,他首先是位诗人。作为第一位荣获诺贝尔文学奖的亚洲人,他将世人的文学视野引向了东方,宗教抒情诗集《吉檀迦利》的成功,不仅为他赢得了世界性殊荣,古老的印度文化也得以更加广泛地播扬。《吉檀迦利》(1910)共收入英译散文诗103首,这部被精选出来献给诗人理想之神的抒情诗集,汇粹着泰戈尔对人生真谛的执着求索和对社会问题的理性沉思,作为诗人思想艺术成熟发展的标识,《吉檀迦利》一向被推为奏出了泰戈尔艺术乐章最佳旋律的巅峰之作。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "论黑格尔的“东方哲学是宗教哲学”说",
          authors: ["朱瑞"],
          source: "西北大学",
          date: "2020-03-01",
          database: "硕士",
          abstract:
            "“东方哲学是宗教哲学”是黑格尔对东方哲学的总体认识。这一认识的产生与当时的东西文化交流背景、时代背景以及黑格尔本人的学术背景密不可分。通过对黑格尔著作的研读以及对黑格尔哲学体系的分析,可以得出“东方哲学是宗教哲学”有两层内涵,(一):“印度哲学是宗教哲学”;(二):“中国没有真正的哲学”。这一结论来源于对黑格尔哲学的归纳与总结,同时又为黑格尔哲学体系内部各部分之间的逻辑联系所证明。黑格尔哲学是合逻辑与合现实的统一,因此他对世界哲学的评价有深厚的哲学基础与现实基础。黑格尔对东方哲学的看法属于黑格尔哲学的一部分,其精神哲学发展的内在逻辑及在此基础上形成的哲学观是黑格尔评价东方哲学的逻辑基础,他对东方宗教、历史深刻的见解与把握是他评价东方哲学的认识基础。黑格尔对东方哲学的认识揭示了东西哲学思维方式的差异,这种差异的特征之一就是西方将精神看作实体,而东方将自然看作实体。从学理上看,黑格尔哲学是在继承了自柏拉图以来的理念论的基础上,将实体本体化、主体化,把理念论的发展推向了最高峰。黑格尔对东方哲学的评价对西方汉学研究中国哲学产生了深远的影响,对黑格尔东方哲学观的研究,可以让我们从一个重要节点,了解中国哲学在西方汉学界的形象。再者,探究黑格尔对中国哲学这一否定性的评价,有利于学人了解中国哲学与西方哲学的差异,为中国哲学在世界哲学体系中自我定位、寻求自身意义与价值,推动中国哲学的进一步发展繁荣提供参考。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "修炼心智:印度宗教哲学的精神",
          authors: ["孙晶"],
          source: "百科知识",
          date: "1997-06-15",
          database: "特色期刊",
          abstract:
            "\u003c正\u003e 印度是一个宗教大国,从整体上讲,印度的精神发展史同宗教发展史是平行的,这是从时间发展上纵向地来看。实际上,一个全民皆教的国家很难说哪种思想属于或不属于宗教思想。宗教在本质上就是体验最终的“实在”,或是与最终“实在”的真正的结合。为了这种体",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "论黑格尔的犹太教观念",
          authors: ["黄伟"],
          source: "吉林大学",
          date: "2021-09-01",
          database: "博士",
          abstract:
            "对黑格尔而言,真正的思辨哲学体系一定包含有宗教哲学这一必不可少的哲学部门,因为对于绝对精神在宗教表象形态下展现自身、实现自身的整个历史而言,哲学有使命且有能力去理解这一历史进程,并将表象形式下所蕴含的精神内涵“提纯”,使之浮现在理性的纯粹意识中,进而认识到宗教表象中的哲学概念,认识到宗教表象与哲学概念是相适应的、相协调一致的,最终揭示出宗教中的理性以及宗教与哲学的同一,这便是黑格尔的宗教哲学及其《宗教哲学讲演录》的真实目的。在《宗教哲学讲演录》中,犹太教被概括为“崇高的宗教”,属于“精神个体性宗教”的第一环节,与希腊宗教(美的宗教)和罗马宗教(合目的性宗教)同处一个大阶段,仅低于作为绝对宗教的基督教,比其它东方各大“自然宗教”的逻辑地位都要高。在黑格尔看来,东方宗教精神(如中国、印度、波斯、埃及等)主要以实体性为原则,西方宗教精神(如希腊、罗马和基督教世界)主要以主体性为原则,而犹太教精神则充分体现了这种从东方到西方、从实体到主体的过渡性特征,它成为东西方宗教的“交汇处”和“分水岭”。所以,犹太教在人类宗教史和文明史上无疑具有相当重要的地位和意义。对于如此重要的纯粹一神教,黑格尔自然要从其思辨哲学的立场来对之进行理性考察,以揭示犹太教中的理性概念和精神内涵,阐述其在宗教精神之历史进展中的合理地位,并最终形成了自己独特的犹太教观念。黑格尔认为,犹太教是“自由主体性”的最初形态——即纯粹的主体性或无限的主体性,此纯粹的无限主体又因自身的抽象性而自我规定为具有实体否定性特征的绝对威力或无限力量,于是,作为独一者的上帝概念也就是自为存在的无限主体和具有抽象实体否定性的绝对力量。“自为存在的无限主体”体现了犹太教精神中的主体性原则,而“具有抽象实体否定性的绝对力量”则体现出犹太教精神中的实体性原则。由上述规定可知,犹太教兼具“实体性”和“主体性”这两大规定,虽尚未达到“实体与主体的绝对同一”之概念高度,但确实在相当程度上特别显明了精神概念之为“实体与主体的同一”这一特征,在作为纯粹独一者的上帝概念之基础上融合了精神概念的实体性与主体性,可以算作是“实体与主体的绝对同一”在某种抽象形态中的特定存在。由此可知,黑格尔自觉运用了其思辨哲学中的实体性和主体性等纯粹概念来考察犹太教,从而实现了对犹太教的一种理性阐释,并在相当程度上挖掘了犹太教精神中的合理内涵,使犹太教与思辨理性相协调相一致。当然,黑格尔的犹太教观念是在一定的历史环境和文化背景之下产生形成的。在黑格尔生活的时代,德国犹太人已发起了“哈斯卡拉”的启蒙运动,犹太教自身也随之进入了改教时期,此为历史环境;而路德、赫尔德、康德和施莱尔马赫等德国新教思想家对犹太教的消极认识,则构成其文化背景。此即本文第一章的内容:“黑格尔犹太教观念形成的历史文化背景”。更为重要的是,黑格尔的犹太教观念还以其思辨哲学的精神概念和宗教概念为根本前提和绝对基础。精神的观念性促使黑格尔认识到犹太教上帝概念的主体性、超越性、无限性和崇高性;精神作为“自我意识着的绝对本质”之概念规定,由于对自由特征的强调,便导致黑格尔对犹太教精神不自由、抽象性的某些批评,亦即犹太教是“抽象的精神宗教”,其上帝还未被理解为自由的精神,而是让人恐惧的抽象上帝;而宗教概念及其历史进展则最终决定了犹太教在《宗教哲学讲演录》中所处的逻辑环节和历史地位,亦即“崇高的宗教”。黑格尔的精神概念、宗教概念和宗教哲学的历史进展,这三部分便构成了本文第二章:“黑格尔犹太教观念的理论基础和哲学根据”。虽然黑格尔宗教哲学对犹太教的精神内涵与合理地位都有很高的评价,但其青年时期的认识却相当片面,几乎全是否定性的批判而缺少同情式的理解,还夹杂着很多带有欧洲反犹色彩的激进言辞,没能认识到犹太教精神的重要性和卓越性。事实上,黑格尔对犹太教的认识与评价经历了从早期到晚期、从批判到同情的复杂演变过程,并最终在1827年宗教哲学讲座中达到了同情态度的最高峰,从而克服了欧洲反犹情绪的负面影响。此部分属于第三章“从批判到同情:黑格尔犹太教观念的演变及其对欧洲反犹偏见的克服”。此外,黑格尔的犹太教观念还在比较宗教学的哲学研究方面具有重要的学术价值和研究意义,特别是有关“一神教”、“一神论”和独一者(或独一神理念)等方面的相关争论。例如:古埃及第十八王朝的阿玛纳宗教是一神教吗?其阿吞神崇拜与犹太一神教有何重大差异?印度教的“梵”是否也具有一神论性质?“梵”的独一性与犹太上帝“雅赫维”的独一性有何“本质区别”?同为“纯粹一神教”的伊斯兰教和犹太教,二者的上帝观念是否也存在着重要差别,特别是在“崇高概念”和“独一者概念”上,此差别的具体内容是什么?此外,基督教三位一体的上帝观与犹太教伊斯兰教的独一上帝观有明显的重大区别,那基督教仍属于一神教吗?我们认为,根据黑格尔宗教哲学及其对犹太教的相关阐释,这些问题都能得到较好的回答。此为第四章、第五章和第六章的内容:“从比较宗教学的视野来看黑格尔的犹太教观念”。黑格尔对犹太教的认识与批判是基于其思辨理性而对犹太教所做出的一种理性阐释,此思辨理性融合了古希腊的理性精神和近代的理性精神,几乎可以说是达到了西方理性主义的最高成就。因此,黑格尔的犹太教观念理应在犹太教的理性化进程中占据着较为重要的地位,是其中所必不可少的一个环节。单就犹太教的理性化而言,黑格尔对此所做出的贡献并不比斐洛、迈蒙尼德、赫尔曼·科恩、马丁·布伯和利奥·拜克等犹太哲学家逊色。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "藏传佛教宗义书对印度“外道”思想的认知与批判",
          authors: ["马玲"],
          source: "宁夏大学",
          date: "2020-05-01",
          database: "硕士",
          abstract:
            "在印度历史上,有许多佛教以外的思想流派,佛教称之为“外道”。藏传佛教宗义书中比较全面地论及了这些流派,这些外道派别包括反对吠陀教义的顺世论和耆那教的思想,还包括继承和发展吠陀教义的传统哲学派别。此外,宗义书中还介绍了印度教的三大教派即自在天派、梵天派和遍入天派。藏传佛教宗义书中虽然涉及到的外道派别较多,但宗义书将外道思想分为常见和断见两类,而之所以采取这样的分类方式,是基于佛教主张缘起性空,否认事物的常在性的立场有关,也说明佛教与断见派的思想交锋是在轮回与解脱观上,与常见派的争论是在空与有的问题上,梳理和分析这些理论,对于全面准确地了解佛教和古印度宗教哲学,具有重要意义。本文以藏传佛教宗义书为中心,对佛教以外的古印度哲学流派思想进行梳理和分析。论文主要包括四个方面的内容:首先,是对“宗义”、“宗义书”历史渊源的考察和“宗义书”基本框架的介绍。接着具体来看格鲁派四部宗义书对这些古印度哲学流派的概述和藏传佛教其它派别对内外道的区分标准,通过详细的解读文本,得出这四部宗义书虽都是格鲁派宗义书,但对这些派别数量及其分类上仍有所差异。对于具体区分内外道的标准而言,藏传佛教格鲁派及其它派基本都是以是否承认三宝(佛、法、僧)为基本皈依对象为界限,承认三宝者为内道,不承认三宝者则为外道。然后是按照“宗义书”叙述古印度哲学派别的方式,一一介绍这些派别并且分析“宗义书”对外道思想在宇宙生成观、因果观和解脱观的批判。最后是关于藏传佛教宗义书“外道”思想评价和意义。在藏传佛教宗义书里,坚决反对断见和常见这两个认识上的极端,体现出佛教与古印度哲学流派思想交锋不仅仅是“空与有”的问题,还有“轮回与解脱”的问题。宗义书中佛教在学理上对诸外道思想进行批判,而并非将外道派别视为异端邪说。宗义书自产生起就成为藏传佛教的经典,被藏传佛教大师奉为“成就之极限”,对藏传佛教在教门发展、教徒修行、传教过程的发展产生了极为深远的影响,也对我们了解印度佛教及其古印度哲学流派,具有重要的史料价值。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "泰戈尔诗歌自然意象研究",
          authors: ["孙凤玲"],
          source: "华中师范大学",
          date: "2017-05-01",
          database: "硕士",
          abstract:
            "泰戈尔在诗歌中营造了丰富多彩的自然意象,以此传达其深邃的梵我合一思想,在有限中实现与无限结合的欢娱。本文旨在通过对泰戈尔诗歌中典型自然意象的阐释,由浅入深论述自然意象背后涉及的宗教哲学命题。本文主要运用新批评的文本细读法,重点论析了两个方面的问题:印度宗教哲学中的两个基本概念“自我”和“大梵”;作为印度宗教哲学的核心命题之“梵我合一”。通过对诗歌的文本细读,揭示出泰戈尔诗歌自然意象所表达的核心命题。同时,本文运用了统计分析法,使自然意象基本形态得以简明呈现,也运用文学地理批评方法阐释自然意象的成因与来源。引言部分对国内外泰戈尔诗歌研究现状进行了简要的梳理,提出本文主题研究的可行性。第一章运用统计分析法,将自然意象归为植物、动物、季候、山川与天体五种,以及在此基础上构成的基本形态。同时,通过一系列图表,将“黄昏”、“鸟”、“莲”、“树”等高频次意象清晰呈现出来。其自然意象的主要特征有四:整体性、群体性、象征性及神秘性。从审美特点来看,自然意象具有鲜活的动态美、静态美与和合之美。第二章从自我生命塑造、自我生命的觉醒和自我生命为获取自由而采取的坚毅果敢的行动三个方面,论述了泰戈尔诗歌中的自我内涵。自我既指个体生命,亦指一切自然生命,诗人极力表现自我生命的喜怒哀乐,是为了阐释梵我合一的思想。第三章结合具体自然意象探讨了“大梵”的基本内涵。第一,“大梵”既是一切花草树木、风云雷电、日月星辰等自然生命,又不具任何形体而潜隐于自然万物之中。第二,通过自然生命的永恒与时间的永恒,阐明“大梵”的不死。第三,Dharma之梵,主要体现了“大梵”作为宇宙精神与终极真理的深层内涵。作为最高宇宙精神的“大梵”,往往与“新娘”、“婚礼”等自然意象相关;作为终极真理的大梵,是不断变化的自然生命与最高创造者内在的和谐统一。第四,创造者“大梵”与自然生命是一种无限与有限、对立又统一的关系。创造者与自然生命内在的和谐,最终由强烈的合一之情——“爱”得以实现。第四章重点探讨自我生命如何实现与“大梵”的合一。作为人类的自我,主要立足于在社会实践中实现与梵合一;同时,死亡和婚礼亦是实现与梵合一的重要方式。作为自然生命的自我,首先通过肯定/否定方式实现合一,其次是通过自然万物与梵内在的同一实现合一;此外,通过死亡与婚礼实现梵我合一。在此基础上,进而论析人、自然与大梵通过物化方式实现合一,以及彼此内在的同一不二。本文的结论是:第一,泰戈尔诗歌中的自然意象有着深厚的宗教哲学内涵;第二,自然意象与自然观是统一的;第三,自然意象既源于诗人自幼生活的地理环境影响,也受其父亲潜移默化的影响,印度传统宗教哲学对自然意象的营造、表达等方面也有重要的影响;第四,泰戈尔梵我合一思想是对东西方宗教哲学的继承与超越。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
        {
          title: "宗教对话与和谐理论的形成和发展",
          authors: ["孙浩然", "冯瑞国"],
          source: "广东教育学院学报",
          date: "2007-04-20",
          database: "期刊",
          abstract:
            "科学的、比较的宗教学研究为宗教间合理解决彼此矛盾、冲突,有效地进行宗教对话,提供了理论前提。开展宗教对话,有利于各宗教文化和平相处,以期达到一种宗教和谐,同时也给民族和平、世界和平提供了一种理论导向。反之,宗教现实问题一再为宗教研究提出了方向和任务,促使宗教研究切实为社会现实服务。这条规律的提出有助于我们有意识地去把握宗教研究方向,切实为宗教和平乃至世界和平做出理论贡献。",
          latex_reference: "",
          search_type: "cnki",
          is_relevant: "no",
        },
      ],
      user_upload_paper_fe_lists: [],
      selectedPapers: [], // 用于存储选中的论文
    };
  },
  props: {
    parentForm: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    saveKeywords() {
      let data = this.keyWordsData;
      save_keywords(data).then((res) => {
        console.log(res, "res");
        let resultData = res.result;
        this.keyWordsData.search_cn_keywords = resultData.search_cn_keywords;
        this.keyWordsData.search_en_keywords = resultData.search_en_keywords;
      });
      // 保存成功 更新关键词列表
    },
    seachPaperS() {
      this.loading = true;
      this.saveKeywords();
      let data = this.keyWordsData;
      search_papers(data).then((res) => {
        let paperList = res.result;
        this.reference_paper_fe_lists = paperList.reference_paper_fe_lists;
        this.user_upload_paper_fe_lists = paperList.user_upload_paper_fe_lists;
        this.loading = false;
      });
    },
    toggleMenu() {},
    getkeyWords() {
      if (!this.parentForm.title) {
        this.$message({
          type: "warning",
          message: "请输入您的论文题目!",
        });
        return false;
      }
      this.loading = true;
      let data = {
        title: "印度宗教的发展与研究",
        language: "中文",
        field: "哲学类",
        type: "本科",
        product: "毕业论文",
        word_count: 8000,
        paper_level: 0,
      };
      generate_keywords(data).then((res) => {
        console.log(res);
        this.keyWordsData = res.result;
        this.loading = false;
      });
    },
    removeKeyword(type, index) {
      if (type === "cn") {
        this.keyWordsData.search_cn_keywords.splice(index, 1);
      } else if (type === "en") {
        this.keyWordsData.search_en_keywords.splice(index, 1);
      }
    },
    addKeyword(type) {
      if (type === "cn" && this.keyWordsData.search_cn_keywords.length < 4) {
        if (this.newCnKeyword.trim()) {
          this.keyWordsData.search_cn_keywords.push(this.newCnKeyword.trim());
          this.newCnKeyword = "";
        }
      } else if (
        type === "en" &&
        this.keyWordsData.search_en_keywords.length < 4
      ) {
        if (this.newEnKeyword.trim()) {
          this.keyWordsData.search_en_keywords.push(this.newEnKeyword.trim());
          this.newEnKeyword = "";
        }
      }
    },
    togglePaperSelection(paper) {
      // 切换选中状态
      console.log(paper, "ssddddel");

      if (paper.is_relevant === "yes") {
        paper.is_relevant = "no";
        // 从选中列表中移除
        this.selectedPapers = this.selectedPapers.filter(
          (selected) => selected.title !== paper.title
        );
      } else {
        paper.is_relevant = "yes";
        // 添加到选中列表
        if (
          !this.selectedPapers.some(
            (selected) => selected.title === paper.title
          )
        ) {
          let newPaper = JSON.parse(JSON.stringify(paper));
          this.selectedPapers.push(newPaper);
        }
      }
    },
    delSelectPaper(paper, event) {
      console.log(this.selectedPapers, "this.selectedPapers");
      // 如果取消选中，从 selectedPapers 中移除
      this.selectedPapers = this.selectedPapers.filter(
        (item) => item.title !== paper.title
      );
      // 搜索到的文件列表
      this.reference_paper_fe_lists.forEach((item) => {
        if (item.title == paper.title) {
          item.is_relevant = "no";
        }
      });
      this.user_upload_paper_fe_lists.forEach((item) => {
        if (item.title == paper.title) {
          item.is_relevant = "no";
        }
      });

      this.saveUserSelect();
    },
    saveUserSelect() {
      let data = {
        key: this.keyWordsData.key,
        reference_paper_fe_lists: [],
        user_upload_paper_fe_list: [],
      };
      this.selectedPapers.forEach((item) => {
        if (item.search_type == "user_upload") {
          data.user_upload_paper_fe_list.push(item);
        } else {
          data.reference_paper_fe_lists.push(item);
        }
      });
      save_papers_list(data).then((res) => {
        console.log("保存成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-left: 40px;
  margin-top: -10px;
  margin-bottom: -20px;
  font-size: 14px;
  width: 100%;
}

.keywordBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}

.keyLeft,
.keyRight {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  ul {
    margin: 10px 0;
  }
  li {
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    height: 40px;
  }
}

h3 {
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.content {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  min-height: 200px;
  max-height: 400px;
}

.sidebar {
  flex: 2;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
}

.sidebar-item,
.sidebar-list {
  margin-bottom: 10px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}
.paper-container {
  margin-bottom: 20px; /* 每篇论文的外边距 */
}

.abstract {
  color: #606060;
  line-height: 1.5;
  word-wrap: break-word;
  overflow: hidden;
  display: flex; /* 使用 flex 布局，让按钮始终紧随内容 */
  align-items: flex-end; /* 按钮对齐到内容末尾 */
}

.abstract.expanded {
  display: block; /* 展开时取消 flex 布局，显示完整内容 */
  -webkit-line-clamp: unset; /* 取消行数限制 */
}

.abstract-content {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 默认显示两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1; /* 占据剩余空间，防止按钮跑到下一行 */
}

.toggle-button {
  color: #409eff; /* 展开/收起按钮颜色 */
  cursor: pointer;
  font-size: 14px;
  margin-left: 5px;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.content-main {
  flex: 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  max-height: 400px;
  overflow-y: auto;
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  ::v-deep(.el-upload-dragger) {
    width: 190px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  ::v-deep(.el-upload) {
    height: 100%;
  }
  ::v-deep(.upload-box) {
    height: 100%;
  }
  ::v-deep(.el-upload-dragger .el-icon-upload) {
    // height: 100%;
    margin-top: -30px;
  }
  .upload-demo {
    height: 100%;
  }
}

.upload-box {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 10px;
  background-color: #f0f8ff;
  text-align: center;
  height: 100%;
}

.upload-button {
  padding: 10px;
  background-color: #e6e6fa;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #d8bfd8;
}

.footer {
  text-align: center;
}

.footer .button {
  width: 100%;
  padding: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  height: 0;
  overflow: hidden;
}

.selected-item {
  .paper-card {
    background-color: rgba(104, 250, 104, 0.1); /* 浅绿色背景 */
  }
}

.selected-paper {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.paper-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.paper-body {
  margin-bottom: 8px;
  color: #666;
}

.paper-footer {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 8px;
  .formPaper {
    background-color: rgba(62, 179, 223, 0.1);
    color: #3eb3df;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 20px;
    font-size: 12px;
    padding: 0 6px;
    margin-right: 10px;
    border-radius: 14px;
    flex-shrink: 0;
  }
  p > span {
    color: #303133;
  }
}
.dateP {
  margin-left: 20px;
}
</style>
