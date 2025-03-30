<template>
  <div>
    <!-- 页面名称 -->
    <div class="pdfShowBox">
      <div class="stickyBox">
        <div class="pdfNavbar">
          <div class="pdfNavLeft">
            <el-tooltip
              class="item"
              effect="dark"
              content="返回第一步,继续创作"
              placement="top"
            >
              <div @click="returnStep" class="pdfLeftBtn g_poin">
                <i class="el-icon-back"></i>
                <p>返回第一步</p>
              </div>
            </el-tooltip>
            <!-- <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Word版论文</span>
            </div>
            <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Latex版论文</span>
            </div> -->
            <div @click="$jumpUrl('/main/reduceRepetition')" class="pdfNavItem">
              <i class="el-icon-film"></i>
              <span>{{ $t("route.reduceRepetition") }}</span>
            </div>
          </div>

          <div
            @click="downLoadPaper"
            v-loading="downStatus"
            v-if="paper_stage == '2'"
            class="pdfNavRight g_poin"
          >
            <i class="el-icon-download"></i>
            <p>下载论文</p>
          </div>
        </div>
      </div>
      <!-- <button @click="startPolling">开始轮询</button>
      <button @click="stopPolling">停止轮询</button> -->

      <div v-if="paperProductStatus" style="height: 30000px">
        <iframe :src="step3PdfUrl" style="width: 100%; height: 100%"></iframe>
      </div>
      <div v-else>
        <el-row style="padding: 20px" :gutter="20">
          <el-col :span="8"
            ><div class="step3Left">
              <el-timeline :reverse="true">
                <el-timeline-item
                  v-for="(activity, index) in task_info_list"
                  :key="index"
                  :type="activity.task_stage == 1 ? 'primary' : 'success'"
                  :timestamp="activity.task_time"
                  placement="top"
                >
                  <el-card>
                    <h4>{{ activity.task_theme }}</h4>
                    <p>{{ activity.task_content }}</p>
                    <p v-if="index != task_info_list.length - 1">
                      {{ activity.task_reasoner }}
                    </p>
                    <p v-else style="margin-top: 15px; line-height: 24px">
                      <i
                        class="el-icon-loading"
                        style="margin-right: 5px; position: relative; top: -2px"
                      ></i>
                      <span
                        v-for="(char, index) in displayedChars"
                        :key="index"
                        class="wave-char"
                      >
                        {{ char }}
                      </span>
                    </p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div></el-col
          >
          <el-col :span="16">
            <div class="step3Right">
              <div class="paperListBox">
                <div
                  v-for="(paper, index) in paper_info_list"
                  :key="index + 'paper'"
                >
                  <div class="paperItem">
                    <!-- 章节名称 -->
                    <p class="itemTitle">
                      {{ paper.chapter_num }}
                      <span>
                        {{ paper.title }}
                      </span>
                    </p>
                    <!-- <div class="itemDesc">
                      {{  }}
                    </div> -->
                    <!-- 显示小节内容 -->
                    <template
                      v-if="paper.sections && paper.sections.length > 0"
                    >
                      <div
                        class="contentItem"
                        v-for="(section, index) in paper.sections"
                        :key="index + 'content'"
                      >
                        <div
                          v-show="
                            section.section_title_num || section.section_title
                          "
                          class="sectionTitle"
                        >
                          <span>
                            {{ section.section_title_num }}
                          </span>
                          <span>
                            {{ section.section_title }}
                          </span>
                        </div>
                        <div class="sectionContent">
                          {{ section.content }}
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div class="pdfBox">
      <PdfViewer :pdfUrl="step3PdfUrl" ref="pdfViewer" />
    </div> -->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      :width="device == 'mobile' ? '90%' : '30%'"
    >
      <p style="line-height: 24px">
        注意：此为预览版，只展示全文的50%。若满意请支付尾款，解锁全文并支持下载，下载有更多的惊喜哟~
      </p>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import PdfViewer from "./PdfViewer.vue";
import { paperPack } from "@/api/user";
import {
  startUniquePaperPolling,
  stopPaperPolling,
} from "@/utils/step3polling";
export default {
  name: "step3",
  data() {
    return {
      oldStr: "",
      old_paper_info_list_length: 0,
      newStr: "",
      paperProductStatus: false,
      // 定义变量
      dialogVisible: false,
      data: "",
      // pdfUrl: require("@/assets/third_output.pdf"),
      pdfUrl: "",
      downStatus: false,
      out_trade_no: "",
      out_trade_no: "5135fc99-75a2-4b17-9321-d791a3817dbe",
      paper_stage: 1,
      task_info_list: [
        {
          task_node: "init",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${init_template}",
          task_content: "${init_template}",
        },
        {
          task_node: "1.1_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.1_content_first_template}",
          task_content: "${1.1_content_first_template}",
        },
        {
          task_node: "1.1_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.1_content_add_reference_template}",
          task_content: "${1.1_content_add_reference_template}",
        },
        {
          task_node: "1.1_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.1_content_rerun_template}",
          task_content: "${1.1_content_rerun_template}",
        },
        {
          task_node: "1.2_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.2_content_first_template}",
          task_content: "${1.2_content_first_template}",
        },
        {
          task_node: "1.2_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.2_content_add_reference_template}",
          task_content: "${1.2_content_add_reference_template}",
        },
        {
          task_node: "1.2_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${1.2_content_rerun_template}",
          task_content: "${1.2_content_rerun_template}",
        },
        {
          task_node: "2.1_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.1_content_first_template}",
          task_content: "${2.1_content_first_template}",
        },
        {
          task_node: "2.1_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.1_content_add_reference_template}",
          task_content: "${2.1_content_add_reference_template}",
        },
        {
          task_node: "2.1_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.1_content_rerun_template}",
          task_content: "${2.1_content_rerun_template}",
        },
        {
          task_node: "2.2_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.2_content_first_template}",
          task_content: "${2.2_content_first_template}",
        },
        {
          task_node: "2.2_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.2_content_add_reference_template}",
          task_content: "${2.2_content_add_reference_template}",
        },
        {
          task_node: "2.2_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${2.2_content_rerun_template}",
          task_content: "${2.2_content_rerun_template}",
        },
        {
          task_node: "3.1_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.1_content_first_template}",
          task_content: "${3.1_content_first_template}",
        },
        {
          task_node: "3.1_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.1_content_add_reference_template}",
          task_content: "${3.1_content_add_reference_template}",
        },
        {
          task_node: "3.1_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.1_content_rerun_template}",
          task_content: "${3.1_content_rerun_template}",
        },
        {
          task_node: "3.2_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.2_content_first_template}",
          task_content: "${3.2_content_first_template}",
        },
        {
          task_node: "3.2_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.2_content_add_reference_template}",
          task_content: "${3.2_content_add_reference_template}",
        },
        {
          task_node: "3.2_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${3.2_content_rerun_template}",
          task_content: "${3.2_content_rerun_template}",
        },
        {
          task_node: "4.1_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.1_content_first_template}",
          task_content: "${4.1_content_first_template}",
        },
        {
          task_node: "4.1_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.1_content_add_reference_template}",
          task_content: "${4.1_content_add_reference_template}",
        },
        {
          task_node: "4.1_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.1_content_rerun_template}",
          task_content: "${4.1_content_rerun_template}",
        },
        {
          task_node: "4.2_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.2_content_first_template}",
          task_content: "${4.2_content_first_template}",
        },
        {
          task_node: "4.2_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.2_content_add_reference_template}",
          task_content: "${4.2_content_add_reference_template}",
        },
        {
          task_node: "4.2_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${4.2_content_rerun_template}",
          task_content: "${4.2_content_rerun_template}",
        },
        {
          task_node: "5.1_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.1_content_first_template}",
          task_content: "${5.1_content_first_template}",
        },
        {
          task_node: "5.1_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.1_content_add_reference_template}",
          task_content: "${5.1_content_add_reference_template}",
        },
        {
          task_node: "5.1_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.1_content_rerun_template}",
          task_content: "${5.1_content_rerun_template}",
        },
        {
          task_node: "5.2_content_first",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.2_content_first_template}",
          task_content: "${5.2_content_first_template}",
        },
        {
          task_node: "5.2_content_add_reference",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.2_content_add_reference_template}",
          task_content: "${5.2_content_add_reference_template}",
        },
        {
          task_node: "5.2_content_rerun",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${5.2_content_rerun_template}",
          task_content: "${5.2_content_rerun_template}",
        },
        {
          task_node: "content_fix_latex",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${content_fix_latex_template}",
          task_content: "${content_fix_latex_template}",
        },
        {
          task_node: "content_fix_second",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${content_fix_second_template}",
          task_content: "${content_fix_second_template}",
        },
        {
          task_node: "content_fix_third",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${content_fix_third_template}",
          task_content: "${content_fix_third_template}",
        },
        {
          task_node: "abstract",
          task_time: "2025-03-25 14:53:08",
          task_stage: 2,
          task_theme: "",
          task_reasoner: "${abstract_template}",
          task_content: "${abstract_template}",
        },
      ],
      paper_info_list: [
        {
          chapter_num: "摘要",
          title: "",
          sections: [
            {
              section_title: "",
              section_title_num: "",
              content:
                "本文在探究磁电耦合检测器于微弱电磁场检测及实时测量中的使用过程中，通过对Metglas/PZT多相物质介面性质的深入分析而逐步阐明出磁性层与压电层之间因机械应力传导传导性所导致的差异性对检测器整体性性能的明显效应，研究员在此进程中不仅选用了尖端的纳米级界面处理工艺以优化粘合性能并使磁电联结系数提升至12.3V/(cm·Oe)，从而实现检测性能的重大改进，同时在信号调节技术上构建引入了频率上变换模型以改进常规检测方案，以期在避免低频干扰干扰的前提下提升准确度，而当设计出包含串并联结构的传感元件阵列后，空间维度精度实现增强至0.5mm且有效去除了环境磁力线的影响，研究员又通过构建磁-机-电多场联结的数学模型，递归式地探讨了磁畴迁移与压电谐振两者间错综复杂相互作用对传感器属性的协作调控影响，使设计出的自适应信号处理结构在-20℃至60℃的广泛温度环境中均能平稳运转，同时在航天涡轮风扇轴承处对弱漏磁信号识别时呈现出检出率与空间检测精细度均有显著性增加的优异表现，该研究不仅系统性地改进了磁电结合换能器的多个核心技术指标，也为相关性理论深化与工程实际采用提供出具有借鉴意义的全新方案。\n\n关键词：磁电耦合传感器，微弱磁场测量，实时检测，信号调控，空间分辨率",
            },
          ],
        },
        {
          chapter_num: "Abstract",
          title: "",
          sections: [
            {
              section_title: "",
              section_title_num: "",
              content:
                "本文在探究磁电耦合检测器于微弱电磁场检测及实时测量中的使用过程中，通过对Metglas/PZT多相物质介面性质的深入分析而逐步阐明出磁性层与压电层之间因机械应力传导传导性所导致的差异性对检测器整体性性能的明显效应，研究员在此进程中不仅选用了尖端的纳米级界面处理工艺以优化粘合性能并使磁电联结系数提升至12.3V/(cm·Oe)，从而实现检测性能的重大改进，同时在信号调节技术上构建引入了频率上变换模型以改进常规检测方案，以期在避免低频干扰干扰的前提下提升准确度，而当设计出包含串并联结构的传感元件阵列后，空间维度精度实现增强至0.5mm且有效去除了环境磁力线的影响，研究员又通过构建磁-机-电多场联结的数学模型，递归式地探讨了磁畴迁移与压电谐振两者间错综复杂相互作用对传感器属性的协作调控影响，使设计出的自适应信号处理结构在-20℃至60℃的广泛温度环境中均能平稳运转，同时在航天涡轮风扇轴承处对弱漏磁信号识别时呈现出检出率与空间检测精细度均有显著性增加的优异表现，该研究不仅系统性地改进了磁电结合换能器的多个核心技术指标，也为相关性理论深化与工程实际采用提供出具有借鉴意义的全新方案。\n\nKeywords: 磁电耦合传感器，微弱磁场测量，实时检测，信号调控，空间分辨率",
            },
          ],
        },
        {
          chapter_num: "第一章",
          title: "引言",
          sections: [
            {
              section_title: "研究背景与意义",
              section_title_num: "1.1",
              content:
                "磁场测量在现代科技发展中占据着举足轻重的地位。从地球磁场探测到生物医学成像，从工业无损检测到航天航空导航，对微弱磁场的精确测量需求日益迫切。磁电耦合传感器作为一种新型的磁场检测装置，凭借其独特的磁电耦合效应，在微弱磁场测量领域展现出巨大的应用潜力。磁电耦合效应本质上是磁致伸缩效应与压电效应的复合作用，可以用磁电耦合方程 \\[ V_m = \\alpha H \\] 来描述，其中 \\( V_m \\) 表示感应电压，\\( \\alpha \\) 为磁电耦合系数，\\( H \\) 为外加磁场强度。这种耦合机制使得磁电传感器能够将微弱的磁场信号转换为可测量的电信号，为微弱磁场检测提供了新的技术路径。\n\n磁电耦合传感器在生物医学领域的应用尤为引人注目。人体心脑电磁信号的强度通常在皮特斯拉量级，传统的磁场检测手段往往难以实现有效测量。磁电耦合传感器通过磁电转换机制，能够将这些极其微弱的生物磁信号转化为可检测的电信号，为无创生物医学检测开辟了新的可能。在工业检测领域，磁电耦合传感器可用于金属构件的无损检测，通过检测材料内部的磁场异常来发现潜在的结构缺陷，这对保障工业设备的安全运行具有重要意义。\n\n然而，磁电耦合传感器在实际应用中仍面临着诸多技术挑战。环境磁场噪声的干扰、传感器本身的灵敏度限制以及实时检测能力的不足，都制约着其在实际应用中的推广。特别是在低频段的微弱磁场检测中，由于环境噪声的影响更为显著，传统的磁电耦合传感器往往难以实现理想的检测效果。这些问题的解决需要从传感器的基础物理机制入手，通过优化材料组成、改进结构设计以及创新信号处理方法来实现。\n\n磁电耦合传感器的研究发展对推动科技进步具有深远意义。在基础科学研究方面，高灵敏度的磁场检测能力为研究微观物理现象提供了有力工具。在工程应用领域，磁电耦合传感器的发展将为工业检测、医疗诊断等领域带来技术革新。随着新材料、新工艺的不断涌现，磁电耦合传感器的性能还有很大的提升空间。通过深入研究传感器的工作机理，优化其结构设计，改进测量方法，有望实现更高灵敏度和更好的实时性能。\n\n本研究着眼于磁电耦合传感器在微弱磁场测量中的关键科学问题，通过理论分析与实验研究相结合的方法，探索提高传感器检测灵敏度和实时性能的新途径。研究成果不仅将推动磁电耦合传感器技术的发展，也将为相关应用领域提供重要的技术支撑。这对于促进科学研究、推动工业进步、改善医疗诊断等方面都具有重要的现实意义。\n",
            },
            {
              section_title: "本研究的主要贡献和创新点",
              section_title_num: "1.2",
              content:
                "本研究在磁电耦合传感器的微弱磁场检测领域取得了多项创新性突破。通过对Metglas/PZT复合结构的深入研究，发现磁性层与压电层之间的界面应力传递效率对传感器性能具有决定性影响。基于这一认识，我们提出了一种新型的界面应力优化方案，采用纳米级粗糙度表面处理技术，使界面结合强度提升了2.7倍，磁电耦合系数\\(\\alpha\\)相应提高至12.3V/(cm·Oe)。这种结构创新不仅增强了传感器的机械稳定性，更重要的是实现了磁电信号转换效率的质的飞跃。\n\n在频率调制方面，我们突破了传统单频检测的局限，创造性地将频率上转换理论引入磁场检测系统。通过在传感器中施加一个载波频率为\\(f_c\\)的交流激励场，使待测直流或低频磁场信号调制到\\(f_c\\)附近的边带频率，有效规避了低频段的\\(1/f\\)噪声干扰。实验证实，这种频率调制方案使传感器在1Hz频率下的检测灵敏度提升了近一个数量级，达到0.34nT，为生物磁场检测开辟了新途径。\n\n针对传统单体传感器空间分辨率不足的问题，我们设计了一种新颖的传感器阵列串并联结构。通过精确控制各单元传感器之间的电磁耦合效应，实现了空间磁场梯度的同步测量。这种结构在保持高灵敏度的同时，将空间分辨率提升至0.5mm，使得传感器能够精确定位微小磁异常源的空间位置。特别值得一提的是，该阵列结构在抑制环境磁场干扰方面表现出独特优势，通过差分测量方式可有效消除均匀背景场的影响。\n\n在实时检测技术方面，我们开发了一套基于现场可编程门阵列的自适应信号处理系统。该系统采用创新的数字锁相算法，将信号采集延迟控制在微秒量级，实现了真正意义上的实时检测。系统还集成了智能温度补偿模块，通过实时监测和校正温度漂移，使传感器在-20℃至60℃的温度范围内保持稳定的检测性能。这一技术突破使得磁电耦合传感器首次具备了工业现场应用的条件。\n\n本研究在理论方面建立了一个多物理场耦合的精确数学模型，该模型首次考虑了磁畴动力学对传感器响应的影响。通过解析磁化过程中的微观机制，我们发现并证实了一个重要现象：在特定频率下，磁畴壁运动会与压电谐振产生协同效应，导致磁电响应显著增强。这一理论发现为进一步优化传感器设计提供了全新思路。\n\n在工程实践层面，我们开发的磁电传感器已在某型航空发动机轴承故障诊断中得到成功应用。传感器能够在发动机运转状态下实时捕捉轴承微弱的漏磁信号变化，提前发现潜在故障。这种应用验证了本研究成果的实用价值，同时也为磁电耦合传感器在工业检测领域的推广奠定了基础。\n",
            },
          ],
        },
        {
          chapter_num: "第二章",
          title: "文献综述",
          sections: [
            {
              section_title: "磁电耦合传感器的研究现状",
              section_title_num: "2.1",
              content:
                "磁电耦合传感器技术在过去十年间经历了快速发展。材料科学的进步为传感器设计提供了新的可能性,通过优化复合材料的层间结构和界面特性,传感器的检测灵敏度已从早期的微特斯拉量级提升至皮特斯拉级别。材料体系从最初单一的铁氧体/压电陶瓷扩展到了包括Terfenol-D、Metglas等新型磁致伸缩材料,这些材料表现出优异的磁机械耦合性能。研究发现,采用非对称叠层结构可显著提高磁电转换效率,这种非对称性导致的应力分布不均匀反而增强了磁电耦合效应。在压电层材料选择方面,PMN-PT单晶的引入使磁电电压系数突破了20 V/(cm·Oe)的理论极限,为后续灵敏度提升开辟了新途径。\n\n信号处理技术的革新为微弱磁场检测提供了有力支撑。频率调制技术的应用使传感器突破了低频噪声的限制,通过将待测信号调制至高频区域实现了对纳特斯拉量级磁场的有效探测。数字信号处理技术的引入不仅提高了检测精度,还使实时监测成为可能。基于现场可编程门阵列的数字锁相放大技术将信号采集延迟控制在微秒量级,这一突破为磁场实时监测奠定了基础。温度漂移补偿技术的发展解决了传感器在实际应用中的稳定性问题,使其在-40℃至80℃的温度范围内保持稳定工作成为可能。\n\n传感器结构设计方面的创新带来了性能的质的飞跃。环形结构的提出有效抑制了杂散磁场的干扰,提高了传感器的方向选择性。多层复合结构的优化不仅提升了灵敏度,还显著改善了传感器的机械强度和使用寿命。阵列式设计的引入则实现了磁场梯度的同步测量,为磁异常源的精确定位提供了新思路。研究表明,优化设计的传感器阵列可将空间分辨率提升至亚毫米量级,这一进展为生物医学成像等领域带来了新的应用前景。\n\n工程应用验证展示了磁电耦合传感器的实用价值。在地球物理勘探中,新型传感器已实现对0.1nT量级地磁场变化的连续监测。生物医学领域的应用研究显示,经过优化的传感器系统可在室温条件下探测到人体心磁信号,为无创诊断技术的发展提供了新的可能。工业无损检测中,磁电传感器在金属构件微裂纹检测方面展现出独特优势,检出率较传统方法提升40%以上。这些成功案例证实了磁电耦合传感器在各领域的应用潜力。\n\n理论研究的深化推动了传感器技术的持续进步。多物理场耦合理论的建立为传感器优化设计提供了理论指导,通过分析磁畴运动与压电效应的相互作用机制,揭示了提高检测灵敏度的新途径。量子效应的引入使研究者开始关注纳米尺度下的磁电耦合现象,这为开发新一代高灵敏度传感器指明了方向。微观尺度的理论突破与宏观工程应用的结合,正推动磁电耦合传感器向更高精度、更强实时性的方向发展。\n",
            },
            {
              section_title: "相关技术与方法",
              section_title_num: "2.2",
              content:
                "磁电耦合传感器的微弱磁场测量涉及多种关键技术与方法。锁相放大器作为核心信号处理设备，通过双相锁相检测技术实现了对微弱信号的提取。这种技术利用参考信号与待测信号的相位关系，通过正交解调将有用信号从噪声背景中分离出来。锁相放大器的工作原理基于信号调制解调理论，其数学表达可描述为：输出信号$V_{out} = \\frac{1}{2}V_{s}V_{r}\\cos(\\phi)$，其中$V_s$为待测信号幅值，$V_r$为参考信号幅值，$\\phi$为两者相位差。通过调节参考信号相位使$\\cos(\\phi)$最大化，即可获得最佳检测效果。实验中采用的SR830型数字锁相放大器具备-120dB的共模抑制比，在1Hz带宽下可实现1nV的电压分辨率，这为捕获微弱磁场信号提供了硬件基础。\n\n示波器在实时波形观测和信号质量评估方面发挥着不可替代的作用。数字存储示波器采用高速采样技术，将连续时间信号转换为离散数字序列。采样定理要求采样频率必须大于信号最高频率的两倍，即$f_s > 2f_{max}$。实验中使用的是Tektronix DPO4054型示波器，其1GHz带宽和5GS/s采样率确保了对磁电信号瞬态特性的准确捕捉。通过示波器的数学运算功能，可实现信号的实时傅里叶分析，揭示频谱特性。频域分析表明，环境磁场干扰主要集中在工频(50Hz)及其谐波频率，这为设计抗干扰方案提供了依据。示波器的深度存储功能(25M点)使长时间记录成为可能，有助于研究磁场信号的统计特性。\n\nLabVIEW虚拟仪器平台为数据采集与分析提供了灵活的解决方案。基于图形化编程环境，构建了集信号采集、处理、显示和存储于一体的测量系统。数据采集模块通过PCI-6259多功能采集卡实现，该卡具备16位分辨率和1MS/s采样速率，满足了高精度测量需求。信号处理算法采用模块化设计，包括数字滤波、相位检测和幅值提取等功能单元。数字滤波器采用Butterworth型IIR结构，其传递函数为$H(z)=\\frac{\\sum_{k=0}^{M}b_kz^{-k}}{1+\\sum_{k=1}^{N}a_kz^{-k}}$，通过调节系数$a_k$和$b_k$可获得最优的滤波特性。实时显示模块采用多线程技术，确保数据处理不影响采集过程的连续性。系统还集成了自动校准功能，通过测量标准磁场源的响应特性，实现传感器输出的定量化。\n\n这些技术方法的有机结合形成了一个完整的测量链。锁相放大器负责信号的初级提取，示波器进行波形监测和质量评估，LabVIEW系统则实现数据的深度分析与管理。通过优化各个环节的参数设置，建立了一套性能稳定、精度可靠的微弱磁场测量方案。实验验证表明，该方案在0.1Hz-1kHz频率范围内可实现0.2nT的磁场分辨率，满足了大多数应用场景的需求。系统的模块化设计还为未来功能扩展预留了接口，可根据具体应用需求进行灵活配置。这些技术的融合不仅提升了测量精度，更重要的是实现了测量过程的自动化和智能化，为磁电耦合传感器的工程应用奠定了基础。\n",
            },
          ],
        },
        {
          chapter_num: "第三章",
          title: "磁电耦合传感器的研究方法",
          sections: [
            {
              section_title: "实验设计与传感器制作",
              section_title_num: "3.1",
              content:
                "磁电耦合传感器的核心制作工艺涉及多重技术环节的精密配合。制备高性能Metglas/PZT复合结构传感器需要从材料选型开始严格把控每个环节。磁致伸缩层选用了饱和磁致伸缩系数达到12ppm的2605SA1非晶带材，这种材料具有极低的矫顽力和优异的软磁特性，在交变磁场作用下产生的应变可达到$10^{-5}$量级。压电层采用了极化强度为0.4C/m\\textsuperscript{2}的PZT-5H陶瓷，其压电应变常数$d_{31}$为-274pC/N，机电耦合系数$k_{31}$高达0.39，这些参数的优化组合为实现高灵敏度奠定了材料基础。\n\n传感器的几何尺寸设计直接关系到磁电转换效率。通过有限元分析发现，当Metglas层厚度为23μm，PZT层厚度为0.8mm时，复合结构在纵向振动模式下表现出最佳的机械耦合性能。长度方向尺寸则需要与目标频率的谐振波长相匹配，实验中将条形传感器的长度确定为40mm，这使其基频谐振点位于理想的工作频段。宽度选择12mm是权衡灵敏度和空间分辨率的结果，过宽会降低传感器的方向选择性，过窄则不利于信号采集。层合结构的界面处理是决定传感器性能的关键环节，我们开发了独特的表面活化工艺，在Metglas表面构建了纳米级凹凸结构，显著增强了界面结合强度，测试结果显示剪切强度达到了3.2MPa。\n\n极化处理工艺的创新是本研究的一大突破。传统的极化方法往往采用恒定电场，这种方式容易在PZT内部产生应力集中，导致电畴取向不均匀。我们设计了阶梯升温-脉冲极化方案，在120℃油浴环境下，施加4kV/mm的脉冲电场，脉宽为0.5s，间隔1s，重复20次。这种方式能够充分激活压电陶瓷的压电性能，同时避免了局部过热和击穿风险。实验数据表明，改进后的极化工艺使压电常数提高了32\\%，且极化稳定性显著增强，在-40℃至85℃温度范围内衰减不超过5\\%。\n\n层合过程采用了精密控制的真空热压工艺。在10\\textsuperscript{-3}Pa真空度下，将环氧树脂胶层厚度严格控制在5μm，并在80℃恒温条件下保持2小时。这种工艺不仅确保了界面结合的致密性，更重要的是避免了气泡和应力集中的产生。传感器封装采用特制的柔性屏蔽外壳，内部填充阻尼材料，这种设计既保护了敏感元件，又有效抑制了环境振动干扰。电极采用真空溅射制备的Au/Cr双层结构，厚度分别为200nm和20nm，这种设计既保证了良好的导电性，又不会显著影响传感器的机械性能。\n\n磁电耦合传感器的性能评估需要在严格控制的环境下进行。我们搭建了专用的测试平台，包括三轴亥姆霍兹线圈系统、磁屏蔽室和精密位移台。通过改变偏置磁场、交流激励场和测试频率，系统地研究了传感器的磁电响应特性。测试结果显示，在最佳工作点，传感器的磁电电压系数达到了14.2V/(cm·Oe)，噪声本底为0.8pT/√Hz@1Hz。这些数据充分验证了制作工艺的可靠性和创新性。通过对批量样品的测试分析，工艺重复性的标准偏差控制在±3\\%以内，这为后续的工程化应用奠定了基础。\n",
            },
            {
              section_title: "信号处理与数据分析",
              section_title_num: "3.2",
              content:
                "磁电耦合传感器的信号处理系统采用了数字化调制解调技术，通过载波调制将微弱磁场信号搬移至高频段以规避低频干扰。我们设计了基于DSP的实时处理平台，利用正交解调原理提取磁场信息。载波信号频率选择在53kHz，避开工频谐波的影响。调制深度通过偏置磁场的强度来调节，实验发现当偏置场强度为3.2Oe时调制效率最高，此时信噪比可提升18dB。解调电路采用双平衡混频器AD835，其转换增益达到500mV/μW，线性动态范围超过80dB。混频输出经过四阶巴特沃斯低通滤波器，截止频率设置为1kHz，确保高频分量充分衰减的同时保持瞬态响应特性。\n\n测量系统的数据采集部分由高精度ADC模块负责，采用24位Σ-Δ型模数转换器ADS1256，在1kHz采样率下可实现0.3μV的电压分辨率。为克服环境温度漂移的影响，开发了自适应基线跟踪算法，其核心思想是利用递推最小二乘法估计温度系数，温度系数由公式$\\alpha_T=\\frac{\\partial V}{\\partial T}|_{H=const}$描述。补偿后的输出电压表达式为$V_{out}=V_m-\\alpha_T\\Delta T$，其中$V_m$为原始测量电压，$\\Delta T$为温度变化量。实验表明，该算法使传感器在-10℃至60℃范围内的零点漂移控制在±0.05nT以内。\n\n信号处理的关键在于提高系统的抗干扰能力。我们创新性地提出了基于小波包分解的自适应降噪方法，将测量信号分解为8个频带，针对不同频带特征选择最优阈值进行系数筛选。小波基函数选用db4小波，分解尺度为4层，能量阈值由贝叶斯准则确定。降噪后的信号重构采用修正的Mallat算法，避免了传统重构过程中的相位失真。实验验证表明，该方法在保持信号快速响应特性的同时，将背景噪声水平降低了约12dB。针对工频干扰问题，设计了自适应陷波器，其传递函数为$H(z)=\\frac{1-2\\cos(\\omega_0)z^{-1}+z^{-2}}{1-2r\\cos(\\omega_0)z^{-1}+r^2z^{-2}}$，其中$r$为极点半径，通过调节$r$值可以平衡陷波深度与带宽。\n\n数据分析系统基于FPGA实现实时处理功能，采用流水线架构提高运算效率。磁场强度计算采用查表插值法，将磁电系数的非线性特性离散化为1024点数据表，插值算法使用三次样条函数，保证了计算精度和实时性的平衡。系统时钟频率为125MHz，单次测量的处理延时控制在4μs以内。为提高测量可靠性，加入了异常值检测模块，基于马氏距离准则识别异常数据点，避免突发干扰对测量结果的影响。长期稳定性测试显示，系统连续工作168小时的重复性误差小于0.3%，证明了信号处理方案的可靠性。\n\n实验数据的统计分析采用改进的Allan方差方法，评估系统的噪声特性。测量结果表明，在1Hz带宽下白噪声水平为0.12pT/√Hz，1/f噪声拐点出现在0.3Hz处。通过对噪声功率谱密度的分析发现，系统的主要噪声来源包括热噪声、磁畴噪声和机械振动，其中磁畴噪声占比约35%。基于这一认识，优化了信号调理电路的带通特性，使系统在0.1Hz至1kHz频率范围内保持平坦的幅频响应，相位延迟不超过5°。这些改进使传感器在微弱磁场探测中展现出优异的性能，为后续工程应用奠定了基础。\n",
            },
          ],
        },
        {
          chapter_num: "第四章",
          title: "实验结果与分析",
          sections: [
            {
              section_title: "传感器性能测试",
              section_title_num: "4.1",
              content:
                "磁电耦合传感器的性能测试在专业磁屏蔽室内进行，环境磁场噪声被控制在50pT/√Hz以下。测试系统采用三轴亥姆霍兹线圈产生标准磁场，通过精密电流源提供激励，配合高精度磁通门磁力计进行场强校准。磁电耦合传感器输出信号与外加磁场强度呈现良好的线性关系，可用磁电耦合方程 \\[V_m = \\alpha H\\] 描述，其中$V_m$为感应电压，$\\alpha$为磁电耦合系数，$H$为外加磁场强度。实验数据表明，在优化的偏置场条件下，传感器表现出优异的检测性能。\n\n传感器在不同频率和场强条件下的性能测试结果如表\\ref{tab:performance}所示：\n\n\\begin{table}[htbp]\n\\centering\n\\caption{传感器性能测试结果表}\n\\label{tab:performance}\n\\begin{tabular}{cccc}\n\\hline\n测试参数 & 测试条件 & 测试结果 & 稳定性\\\\\n\\hline\n交流磁场分辨率 & 1Hz & 0.20 nT & $\\pm$2.3\\%\\\\\n直流磁场分辨率 & DC & 0.34 nT & $\\pm$3.1\\%\\\\\n最小可探测场强 & 0.5 Oe偏置 & 134 pT & $\\pm$1.8\\%\\\\\n磁电耦合系数 & 室温 & 14.2 V/(cm·Oe) & $\\pm$2.5\\%\\\\\n频率响应带宽 & -3dB & 0.1Hz-1kHz & $\\pm$0.8\\%\\\\\n温度漂移 & -10℃~60℃ & $\\pm$0.05 nT/℃ & $\\pm$4.2\\%\\\\\n\\hline\n\\end{tabular}\n\\end{table}\n\n传感器对交流磁场的检测灵敏度随频率变化表现出独特特性，如图\\ref{fig:ac_resolution}所示：\n\n\\begin{figure}[htbp]\n\\centering\n\\begin{tikzpicture}\n\\begin{axis}[\n    xlabel={频率 (Hz)},\n    ylabel={分辨率 (nT)},\n    xmode=log,\n    ymode=log,\n    grid=major,\n    width=0.8\\textwidth,\n    height=0.6\\textwidth,\n    legend pos=north west\n]\n\\addplot[blue,thick] coordinates {\n    (0.1,0.8)\n    (1,0.2)\n    (10,0.15)\n    (100,0.18)\n    (1000,0.25)\n};\n\\legend{实测数据}\n\\end{axis}\n\\end{tikzpicture}\n\\caption{交流磁场分辨率随频率的变化关系}\n\\label{fig:ac_resolution}\n\\end{figure}\n\n深入分析测试数据揭示了传感器性能的若干关键特征。在直流磁场测量中，传感器表现出0.34nT的分辨率，这一指标优于常规磁通门磁力计。动态响应测试显示，传感器在0.1Hz至1kHz的频带内保持平坦的幅频特性，相位延迟控制在5°以内。特别值得关注的是，在0.5Oe偏置磁场条件下，传感器成功检测到了134pT的微弱交流磁场变化，这一结果验证了频率上转换调制技术的有效性。\n\n温度漂移测试结果表明，采用自适应基线跟踪算法后，传感器在-10℃至60℃温度范围内的零点漂移被控制在±0.05nT/℃，远优于未经补偿时的±0.23nT/℃。长期稳定性测试持续168小时，重复性误差始终保持在0.3%以内，证实了传感器结构设计和封装工艺的可靠性。噪声分析显示，在1Hz带宽条件下，系统噪声谱密度为0.12pT/√Hz，其中磁畴噪声贡献约占35%，热噪声和机械振动分别占比28%和25%，剩余12%来自电子学噪声。\n\n为验证传感器在实际应用中的性能，开展了航空发动机轴承微弱漏磁信号检测实验。测试结果显示，传感器能够有效捕获5mm深度裂纹产生的40pT量级磁场异常，检出率达到95%以上，证实了其在工业无损检测领域的应用潜力。空间分辨率测试采用标准磁偶极子源，在距离传感器2cm处移动测试源，获得的空间分辨能力达到0.5mm，满足精密定位需求。这些实验结果充分证实了本研究在提升磁电耦合传感器检测灵敏度和实时性方面取得的突破性进展。\n",
            },
            {
              section_title: "实时检测能力分析",
              section_title_num: "4.2",
              content:
                "实时磁场检测的技术难点在于实现低频响应与高速采样的有机统一。我们设计了基于多阶数字积分器的实时处理方案，将采样频率提升至125kHz，配合32位浮点运算单元实现了亚微秒级的数据处理能力。实验发现，调制深度是影响实时检测性能的关键因素。通过扫描0.1至0.9的调制深度范围，在0.65处观察到最佳的信噪比表现。这一现象源于调制深度过大会引入额外的谐波分量，而过小则会降低有效信号强度。实验数据显示，最优调制深度下系统的等效噪声带宽降至0.8Hz，同时保持了35ms的系统响应时间。\n\n磁场实时监测系统采用双通道并行架构，一个通道负责快速数据采集，另一个通道执行数字信号处理。这种设计避免了数据处理对采样过程的干扰。FPGA处理器采用流水线结构实现信号调理算法，其中包括16阶FIR滤波器、希尔伯特变换器和复数乘法器。通过优化资源分配，处理延迟被控制在4.2μs以内。动态范围测试显示，系统在±100nT范围内保持线性度优于0.1%，满量程噪声小于系统分辨率的十分之一。磁场阶跃响应实验证实，在保持0.2nT分辨率的同时，系统建立时间仅需28ms，这比传统锁相放大方案快近一个量级。\n\n针对低频磁场检测这一技术难点，我们开发了一种新型补偿策略。传统方法在低频段往往受限于1/f噪声，而我们通过在反馈环路中引入动态基准跟踪技术，显著改善了低频性能。实验数据表明，在0.1Hz频率点处，系统噪声水平降至0.35pT/√Hz，这一指标较未使用补偿技术时提升了3.8倍。补偿环路的带宽可调范围为0.01Hz至10Hz，满足了不同应用场景的需求。为验证系统的长期稳定性，我们进行了持续一周的连续监测实验。结果显示，在室温±2℃波动范围内，测量结果的标准偏差保持在0.15nT以内，证实了补偿策略的有效性。\n\n实时自动测量系统的创新之处在于实现了智能触发功能。系统通过分析磁场信号的时频特征，自动识别有效信号与背景噪声。我们设计的判决算法基于小波包能量分布特征，结合改进的模式识别方法，将虚警率控制在$10^{-6}$量级。触发延迟时间不超过100μs，这对于大多数工业应用场景而言已经足够。系统还具备自适应阈值调节能力，可根据环境噪声水平自动优化检测参数。在工业现场测试中，即使在强电磁干扰环境下，系统仍能可靠捕获150pT量级的瞬态磁场变化。\n\n\\begin{figure}[htbp]\n\\centering\n\\begin{tikzpicture}\n\\begin{axis}[\n    xlabel={调制深度},\n    ylabel={信噪比 (dB)},\n    grid=major,\n    width=0.8\\textwidth,\n    height=0.6\\textwidth,\n    legend pos=north west\n]\n\\addplot[blue,thick,smooth] coordinates {\n    (0.1,15)\n    (0.2,22)\n    (0.3,28)\n    (0.4,35)\n    (0.5,42)\n    (0.65,48)\n    (0.7,46)\n    (0.8,40)\n    (0.9,32)\n};\n\\legend{实测数据}\n\\end{axis}\n\\end{tikzpicture}\n\\caption{调制深度对信噪比的影响关系}\n\\label{fig:mod_depth}\n\\end{figure}\n\n面向实际应用需求，我们开发了多模式运行策略。连续监测模式下，系统以最高125kHz的速率采集数据，适用于快速变化磁场的实时跟踪。能量节省模式则采用自适应采样策略，在信号平稳期间降低采样率至1kHz，检测到突变时自动切换至高速采样。这种设计使系统功耗降低了78%，同时保持了对突发事件的快速响应能力。针对周期性磁场信号，我们实现了相位同步采样技术，有效抑制了采样时序抖动带来的相位噪声，使相位分辨率提高到0.1°。系统还集成了数据压缩存储功能，采用改进的游程编码算法，在保持信号完整性的前提下将存储需求降低了85%。测试结果表明，即使在连续工作168小时后，系统的检测灵敏度和时间分辨率仍无明显退化，证实了实时检测方案的可靠性和稳定性。\n",
            },
          ],
        },
        {
          chapter_num: "第五章",
          title: "讨论与结论",
          sections: [
            {
              section_title: "研究讨论",
              section_title_num: "5.1",
              content:
                "磁电耦合传感器的开发过程为我们揭示了一系列值得深入探讨的科学问题。在材料设计方面，非晶合金与PZT压电陶瓷的复合结构虽然实现了优异的磁电耦合效应，但界面结合强度仍存在提升空间。目前采用的表面纳米结构化处理虽已将界面剪切强度提高到3.2MPa，但在长期机械振动环境中仍可能出现界面剥离现象。未来可考虑引入原子层沉积等新型表面处理技术，通过在界面引入过渡层来进一步增强结合稳定性。同时，压电层的极化工艺虽然通过脉冲电场处理提高了压电常数，但极化均匀性仍有待改善，这直接影响传感器的一致性和重复性。\n\n信号检测方面的一个关键发现是系统噪声的构成比例，其中磁畴噪声占比高达35%远超预期。这提示我们在未来的优化中应重点关注磁性材料的畴壁钉扎效应，可能需要通过热处理或掺杂改性来优化磁畴结构。另一个值得注意的现象是传感器在1Hz至100Hz频段表现出最佳的分辨率特性，这与预期的低频性能衰减规律有所不同。深入分析发现，这可能源于压电层的机械谐振特性与磁致伸缩效应在该频段发生了有益的相互作用，为进一步优化频率响应特性提供了新思路。\n\n实时检测系统采用的多模式运行策略虽然显著降低了功耗，但模式切换过程中偶尔会出现短暂的数据丢失。这个问题的根源在于采样率切换时序的不完善，需要通过改进FPGA中的状态机设计来实现无缝切换。数据压缩算法虽然将存储需求减少了85%，但在某些快速变化的磁场信号中可能造成细节信息的损失，这启发我们思考如何在压缩效率和信号保真度之间取得更好的平衡。\n\n温度漂移补偿是另一个需要深入探讨的问题。目前采用的自适应基线跟踪算法在-10℃至60℃范围内表现良好，但补偿效果仍显示出微弱的非线性特征，这暗示温度与磁电耦合效应之间可能存在更复杂的关系。建议未来通过构建多参数热力学模型来实现更精确的温度补偿。同时，系统的长期稳定性测试虽然达到了168小时的持续工作能力，但在实际工程应用中可能需要更长期的可靠性保证，这要求我们进一步研究材料老化机制和失效模式。\n\n航空发动机轴承检测的实地验证为我们展示了一个极具前景的应用方向。传感器成功检出40pT级的微弱磁场异常，这一灵敏度水平已经接近理论极限。但在实际应用中，复杂的电磁环境可能导致检测可靠性下降，建议开发基于深度学习的信号特征识别算法，以提高缺陷诊断的准确性。空间分辨率方面，虽然在2cm探测距离下实现了0.5mm的位移分辨能力，但随着探测距离增加，分辨率会迅速下降，这个问题可能需要通过设计新型磁场聚焦结构来解决。\n\n展望未来，磁电耦合传感器在生物医学成像、地磁导航、空间探测等领域都显示出广阔的应用前景。特别是在生物医学领域，如果能将检测灵敏度进一步提升到10pT量级，将有望实现单个神经元放电的无创检测。这需要在材料设计、结构优化、信号处理等多个层面实现突破，为后续研究指明了方向。\n",
            },
            {
              section_title: "研究结论",
              section_title_num: "5.2",
              content:
                "本研究通过对磁电耦合传感器的系统性研究，在材料设计、结构优化、信号处理等多个方面取得了显著成果。在材料体系方面，创新性地将2605SA1型非晶合金与PZT-5H压电陶瓷进行复合，并通过表面纳米结构化处理使界面剪切强度达到3.2MPa，为传感器的高性能运行奠定了物质基础。结构设计上，基于有限元分析确定了最优的几何参数配置，使传感器在40mm长度与12mm宽度的结构下实现了基频谐振与工作频段的完美匹配。极化工艺的改进采用了阶梯升温与脉冲电场协同作用的新方法，在120℃恒温油浴中施加4kV/mm的脉冲电场，使压电常数提升了32%，且在宽温域内性能波动控制在5%以内。\n\n信号处理系统的创新设计显著提升了传感器的检测能力，通过数字化调制解调技术成功将微弱磁场信号转移至高频段，有效规避了低频干扰。基于DSP的实时处理平台结合自适应基线跟踪算法，使传感器在-10℃至60℃范围内的零点漂移控制在±0.05nT，展现出优异的温度稳定性。小波包分解的自适应降噪方法将背景噪声水平降低约12dB，同时保持了信号的快速响应特性。系统在1Hz带宽条件下实现了0.12pT/√Hz的白噪声水平，1/f噪声拐点出现于0.3Hz处，这些指标均处于国际领先水平。\n\n在实际性能验证方面，传感器展现出卓越的检测能力，直流磁场分辨率达到0.34nT，在0.5Oe偏置条件下成功捕获134pT的微弱交流磁场扰动。长期稳定性测试显示系统能够连续工作168小时的情况下保持重复性误差小于0.3%，充分验证了设计方案的可靠性。在航空发动机轴承缺陷检测的实地验证中，成功识别出5mm深度裂纹引发的40pT级磁场异常，检出率突破95%，在2cm探测距离下实现0.5mm级的位移分辨能力，为工业无损检测提供了新的技术方案。\n\n展望未来，磁电耦合传感器的研究仍有广阔发展空间。在材料层面，可以探索原子层沉积等新型表面处理技术，进一步提升界面结合强度；在结构设计方面，需要深入研究磁畴结构的调控方法，通过热处理或掺杂改性降低磁畴噪声的影响；信号处理系统可以引入深度学习算法，提高缺陷特征的识别准确率。随着检测灵敏度向10pT量级迈进，传感器在生物医学成像、地磁导航以及空间探测等领域将展现更大的应用价值。本研究的成功经验为磁电耦合传感器的进一步发展指明了方向，也为相关领域的技术创新提供了有益借鉴。\n",
            },
          ],
        },
      ],
      displayedChars: [], // 用于逐个展示的字符列表
      intervalId: null, // 定时器ID，用于清除定时器
    };
  },
  components: {
    PdfViewer,
  },
  computed: {
    // 计算属性
    ...mapGetters(["step3PdfUrl", "currentOrder", "activeIndex", "device"]),
  },

  watch: {
    activeIndex: {
      handler(val) {
        this.$log("activeIndexval", val);
        if (val !== 3) {
          this.stopPolling();
        }
        // 更新首页大纲列表
        // eventBus.emit("step0Reload", true); // 发布事件
      },
    },
    step3PdfUrl(newValue, oldValue) {
      this.dialogVisible = false;

      // 在这里执行你需要的逻辑
      if (this.currentOrder.payment_status == "TRADE_DEPOSIT_SUCCESS") {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = true;
          }, 1000);
        });
      } else {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = false;
          }, 1000);
        });
      }
    },
    pdfUrl: {
      handler(newVal, oldVal) {
        this.pdfUrl = newVal;

        if (this.currentOrder.payment_status == "TRADE_SUCCESS") {
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      },
      deep: true, // 启用深度监听
    },
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    console.log("step3初始化");
  },
  created() {
    eventBus.on("startStep3Polling", this.startPolling); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("startStep3Polling", this.startPolling); // 移除事件监听
    this.stopPolling();
  },

  methods: {
    startDisplay(inputString) {
      // 清空当前展示内容
      this.displayedChars = [];

      // 确保没有遗留的定时器
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      let index = 0; // 当前展示的字符索引

      // 每100毫秒展示一个字符
      this.intervalId = setInterval(() => {
        if (index < inputString.length) {
          this.displayedChars.push(inputString[index]); // 添加当前字符到展示列表
          index++;
        } else {
          // 如果展示完成，清除定时器
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }, 100); // 每100毫秒添加一个字符
    },
    // 启动轮询
    startPolling(data) {
      if (!data.out_trade_no) {
        Ming("step3没有值", data);
        return false;
      }
      const requestData = {
        out_trade_no: data.out_trade_no,
      }; // 请求数据

      // 开始轮询，并传入回调处理结果
      startUniquePaperPolling(requestData, (result) => {
        console.log("轮询完成，接收到结果：", result);

        // 处理接收到的结果
        // 比如更新组件数据或触发其他逻辑
        this.handlePollingResult(result);
      });
    },

    handlePollingResult(result) {
      // 处理轮询结果的逻辑
      this.task_info_list = result.task_info_list;
      this.paper_stage = result.paper_stage;
      this.paper_info_list = result.paper_info_list;
      let lastTimeLine = this.task_info_list[this.task_info_list.length - 1];
      console.log("处理轮询结果lastTimeLine：", lastTimeLine);
      // 需要做渐入的
      this.oldStr = JSON.parse(JSON.stringify(lastTimeLine.task_theme));
      console.log("处理轮询结果this.oldStr：", this.oldStr);
      if (this.old_paper_info_list_length == 0) {
        this.old_paper_info_list_length = this.paper_info_list.length;
        this.startDisplay(this.oldStr);
      } else {
        if (this.paper_info_list && this.paper_info_list.length > 0) {
          if (this.old_paper_info_list_length < this.paper_info_list.length) {
            this.startDisplay(this.oldStr);
          }
        }
      }
      console.log("处理轮询结果：", result);
    },
    // 停止轮询
    stopPolling() {
      stopPaperPolling();
    },
    returnStep() {
      this.stopPolling();

      this.$store.dispatch("app/setActiveIndex", 0);
    },
    downLoadPaper: _.debounce(function (item) {
      this.downStatus = true;
      zhuge.track(`下载论文`, {
        路径: "step3",
        订单Out_trade_no: this.currentOrder.out_trade_no,
      });
      paperPack({ out_trade_no: this.currentOrder.out_trade_no }).then(
        (res) => {
          this.downStatus = false;
          // window.open(res.result.zip_url, "_blank");
          // Create a temporary link element
          const link = document.createElement("a");
          link.href = res.result.zip_url;
          const regex = /\/([^\/]+)\.zip$/;
          const match = res.result.zip_url.match(regex);
          // Set the download attribute to suggest a filename

          match + ".zip"; // Change 'filename.zip' to the desired file name
          if (match && match[1]) {
            link.download = match[1] + ".zip";
          } else {
            link.download = "论文" + ".zip";
          }
          // Append the link to the body
          document.body.appendChild(link);

          // Programmatically click the link to trigger the download
          link.click();

          // Remove the link from the document
          document.body.removeChild(link);
        }
      );
    }, 1000),
    // 定义方法
    onViewFile(item) {
      if (item.fileName.split(".").pop() === "pdf") {
        let url =
          "/pdfjs/web/viewer.html?file=" +
          process.env.VUE_APP_BASE_API +
          item.filePath;
        window.open(url, "_blank");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.pdfBox {
}
.pdfShowBox {
  background-color: #fff;
}
.iframe-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 这个比例可以根据你的需求调整 */
  height: 0;
  overflow: hidden;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.my-bullet {
  width: 0.1rem;
  height: 0.1rem;
  display: inline-block;
  border-radius: 50%;
  background: #b7b6b9;

  &:nth-child(2) {
    margin: 0 0.1rem;
  }
}

.my-bullet-active {
  background: #fd882e;
}

.pdfNavbar {
  max-width: 1120px;
  // margin: 0 auto;

  height: 64px;
  background: rgba(245, 248, 255, 0.95);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .pdfNavItem {
    margin-right: 40px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #3355ff;
    line-height: 22px;
    text-align: left;
    font-style: normal;

    span {
      margin-left: 10px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .pdfNavLeft {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  }

  .pdfNavRight {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .pdfLeftBtn {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-right: 10px;
  }
}

.stickyBox {
  position: relative;
}
.backStep {
  font-size: 30px;
  background: #3355ff;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
}
.itemTitle {
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  color: #000;
  height: 1.75rem;
  line-height: 1.75rem;
  font-weight: 700;
  padding-left: 0.3125rem;
  border-radius: 0.3125rem;
  margin: 30px 0 10px 0;
}
.contentItem {
  background: #f7f9fa;
  padding: 10px 20px;
}
.sectionTitle {
  display: inline-block;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 溢出部分用省略号表示 */
  font-size: 14px;
  font-weight: bold;
  color: #000;
  height: 28px;
  line-height: 28px;
  font-weight: bold;
  padding-left: 5px;
  border-radius: 5px;
}
.sectionContent {
  border-radius: 5px;
  margin: 5px;
  line-height: 24px;
  font-size: 14px;
  // padding-top: 10px;
  padding: 10px;
  background: #f7f9fa;
}

// 跳动效果
.wave-char {
  display: inline-block;
  transform-origin: bottom;
  animation: waveJump 1s ease-in-out infinite;
}

/* 跳跃波浪效果 */
@keyframes waveJump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1px); /* 跳跃高度 */
  }
}
</style>
