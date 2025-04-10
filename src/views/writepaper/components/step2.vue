<template>
  <div class="step2Box">
    <div id="top" class="outLineTitle">
      <p class="oulineTitlePaper"><span>题目: </span>{{ requestForm.title }}</p>
      <p class="outlineTitleDesc">
        <span>科目: </span>
        {{
          requestForm.field && typeof requestForm.field == "string"
            ? requestForm.field
            : requestForm.field[1]
        }}
        <span style="margin-left: 50px">类型: </span>
        {{ requestForm.type ? requestForm.type : "暂无" }}
      </p>
    </div>
    <!-- 大纲 -->
    <!-- {{ outlineData }} -->
    <div
      v-loading="loading"
      element-loading-text="AI帮写中,请稍等...."
      class="outlineMain"
      ref="outlineParent"
    >
      <div>
        <tips :parentHeight="parentHeight"></tips>
      </div>
      <!-- <p class="tips">拖拽章节,可实现章节排序</p> -->
      <!-- <p class="tips">当您编辑大纲时,会自动保存</p> -->

      <div class="tipOutline">
        <el-tooltip class="item" effect="dark" placement="top">
          <template slot="content">
            <p style="width: 200px; line-height: 20px">
              当新增章节但是没有描述插入内容，或者当选择开启图表、代码、Latex公式等但没有提供详细说明，可以点击AI帮写，AI会帮你补充细节
            </p>
          </template>

          <p class="g_poin btnDefault btnStarBorder" @click="saveOutlineTwo()">
            <span class="btnStarDe">
              <img src="@/assets/images/index/icon_32_star.png" alt="" />
            </span>
            AI帮写
          </p>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="付费下载大纲"
          placement="top"
        >
          <p class="g_poin btnDefault bgDeBtn" @click="downLoadLine">
            <i class="el-icon-download"></i>
            付费下载大纲
          </p>
        </el-tooltip>
        <p class="detailText">点击文字即可编辑，当您编辑大纲时将自动保存</p>
      </div>
      <!-- draggable // 支持用户拖拽-->
      <el-tree
        :data="outline"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
      >
        <div class="slotContentBox" slot-scope="{ node, data }">
          <div
            :class="['custom-tree-node', { 'dynamic-class': data.level === 1 }]"
          >
            <div class="inputBoxMain">
              <!-- 如果是编辑状态 -->
              <div class="pageSource">
                <span v-if="data.index < 99"
                  >第{{ numberToChinese(data.index) }}章
                </span>
                <span v-else> {{ data.index }} </span>
              </div>
              <template v-if="data.isEdit == 1 || !data.title">
                <input
                  ref="input"
                  class="editInput"
                  placeholder="请输入您对应的标题或点击AI帮写..."
                  size="mini"
                  @blur="() => submitEdit(node, data)"
                  v-model="data.title"
                />
              </template>
              <!-- 如果不是编辑状态 -->
              <span
                v-else
                class="showSpan"
                @click="() => edit(node, data)"
                v-text="data.title"
              ></span>
            </div>

            <div :class="['iconRight', { titleRight: data.level === 1 }]">
              <div>
                <el-tooltip
                  v-if="data.level >= maxLevel"
                  placement="top"
                  content="插入图表配置"
                >
                  <span class="insetImgSpan" @click="showImgF(data)">
                    <i class="el-icon-edit-outline"></i>
                    <span v-show="device !== 'mobile'">插入图表</span>
                  </span>
                </el-tooltip>
                <!-- 新增 -->
                <el-tooltip
                  v-if="data.level == 1"
                  class="item addL1Item"
                  effect="dark"
                  content="在当前一章后新增一章"
                  placement="top"
                >
                  <i
                    @click="() => appendShowSibling(node, data)"
                    class="el-icon-circle-plus-outline g_poin"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-else
                  class="item itemL2Item"
                  effect="dark"
                  content="在当前小节后新增一个小节"
                  placement="top"
                >
                  <span
                    class="insetImgSpan"
                    @click="() => appendShowSibling(node, data)"
                  >
                    <i class="el-icon-circle-plus-outline g_poin"></i>
                    <span v-show="device !== 'mobile'">新增小节</span>
                  </span>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除本章/本小节"
                  placement="top"
                >
                  <span
                    class="insetImgSpan g_danger"
                    @click="() => remove(node, data)"
                  >
                    <i class="el-icon-delete g_poin"></i>
                    <span v-show="device !== 'mobile'">删除</span>
                  </span>
                </el-tooltip>
              </div>
              <div v-if="data.level >= maxLevel" class="rightbottom">
                <!-- 表 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="已插入表格"
                  placement="top"
                >
                  <i
                    v-show="data.insert_table && data.insert_table.status"
                    class="el-icon-s-marketing"
                  ></i>
                </el-tooltip>

                <!-- 图 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="已插入图形"
                  placement="top"
                >
                  <i
                    v-show="data.insert_plot && data.insert_plot.status"
                    class="el-icon-picture"
                  ></i>
                </el-tooltip>
                <!-- 公式 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="已插入公式"
                  placement="top"
                >
                  <i
                    v-show="
                      data.insert_latex_formula &&
                      data.insert_latex_formula.status
                    "
                    class="el-icon-s-flag"
                  ></i>
                </el-tooltip>
                <!-- 代码 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="已插入代码"
                  placement="top"
                >
                  <i
                    v-show="data.insert_code && data.insert_code.status"
                    class="el-icon-s-management"
                  ></i>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-if="data.level !== 1" class="contentInput">
            <!-- <textarea type="textarea" v-model="data.content"  /> -->
            <textarea-autosize
              class="ownInput"
              rows="1"
              placeholder="请输入您对应的章节内容,或点击AI帮写..."
              ref="myTextarea"
              @blur.native="saveSummary"
              v-model="data.summary"
            />
          </div>
        </div>
      </el-tree>
    </div>
    <div class="btnList outlineRepeat">
      <p class="g_poin btnDefault btnStarBorder" @click="saveOutlineTwo()">
        <span class="btnStarDe">
          <img src="@/assets/images/index/icon_32_star.png" alt="" />
        </span>
        AI帮写
      </p>
      <p class="g_poin btnDefault bgDeBtn" @click="downLoadLine">
        <i class="el-icon-download"></i>
        付费下载大纲
      </p>
      <p class="g_poin btnDefault" @click="reloadOutline">
        <i class="el-icon-refresh"></i>
        大纲不满意? 重新生成
      </p>
    </div>
    <!-- 付费项选择 -->
    <div id="reduceId"></div>

    <additional v-model="selectValue"></additional>
    <!-- <p>当前选中的值是：{{ selectValue }}</p> -->
    <div class="warningP agreeText">
      <el-checkbox v-model="checked">
        我已阅读并同意：平台所生成的全文为范文，仅用作参考，不用作毕业论文、发表刊物等
      </el-checkbox>
    </div>
    <div class="warningP generateSpan">
      <!-- <span class="g_poin" @click="showSlider">生成全文</span> -->
      <!-- <span class="g_poin" @click="saveOutline('reduce')">生成全文</span> -->
      <span class="g_poin" @click="reloadSave('reduce')">生成全文</span>
      <!-- <span class="g_poin" @click="textF">生成全文</span> -->
    </div>
    <div class="wxContentMessage">
      <img
        class="warningLight"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQVJREFUOE+l0zEvw0EYx/HPlcHQQcJgsFkNFmG96OIVMErYDQaSDgwSC7vEYLF4D62/l2EwkBhtJAxNTq7OoGlL29vuyfN87/c893uCCU8YVp8qszjGDlZD9JjzU2UGu7gdCEiVLZxjsTwSQ3Sf7qwJbtBB7AJSy5ygHjY8p7YlNZdo9Kj7BlSapfgiRJ1QAqc5OUT5niWf9GmtC+iN54I31CcBpB/quApGAqTKMvYxjZfcwqiAlQLIwl9HBvQb4gddY4z9C2c4GhtQrLmQVYToqQzpCusDjHRYBpiN9DnYym17arK6+V9WbmmYco13bP61TLk4Q7bLMj0Uxdl4B0OX6b9b/gXmiHMHzvfyVAAAAABJRU5ErkJggg=="
        alt=""
      />
      <div style="height: 40px; width: 260px">
        <el-carousel
          height="40px"
          indicator-position="none"
          direction="vertical"
          :autoplay="true"
          :loop="true"
        >
          <el-carousel-item v-for="(item, index) in papers" :key="'pt' + index">
            <p class="paperTitleLight">{{ item }}</p>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div style="height: 50px"></div>
    <!-- 生成全文操作前置声明 -->
    <el-dialog
      title="提示"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="statementDialogVisible"
      :width="device == 'mobile' ? '90%' : '30%'"
    >
      <span
        >平台所生成的全文为范文，仅用作参考，不用做毕业论文、发表刊物等</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="agreeGenerate"
          >同意并生成全文</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="editStatus"
      width="40%"
    >
      <div slot="title">
        <p class="dialogTitle">
          <i class="el-icon-folder-add dialogIcon"></i>
          新增章节
        </p>
        <p class="warningText">
          🔔 全文生成效果受章节数和概要内容影响，请谨慎修改
        </p>
      </div>
      <el-form
        :model="numberValidateForm"
        ref="numberValidateForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <!-- <el-radio-group
          v-if="insertSibling"
          v-model="numberValidateForm.insertPosition"
        >
          <el-radio label="after">本章之后</el-radio>
          <el-radio label="before">本章之前</el-radio>
        </el-radio-group> -->
        <el-form-item
          :label="appendLevel == 1 ? '请输入章节标题' : '请输入小节名称'"
          prop="appendValue"
          :rules="[{ required: true, message: '章节不能为空' }]"
        >
          <el-input
            placeholder="请输入内容"
            v-model="numberValidateForm.appendValue"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="appendLevel !== 1"
          label="请输入小节内容"
          prop="appendValue"
        >
          <el-input
            placeholder="请输入小节内容"
            v-model="numberValidateForm.appendContent"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm('numberValidateForm')">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 插入图表 -->
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      title="插入图表"
      :visible.sync="imgExcelSetStatus"
      :width="device == 'mobile' ? '90%' : '60%'"
      label-width="130px"
    >
      <div class="tipsCon">
        <p>操作说明：</p>
        <p>
          <span>第一步：</span>
          可以点击左边的开关，开启代表想在本小节添加对应的内容，关闭代表不添加；
        </p>
        <p>
          <span>第二步：</span>

          右侧的内容说明如果不想写可以留空，等最后点击【AI帮写】，AI会自动补充合适的内容。
        </p>
      </div>
      <el-form
        :model="numberValidateForm"
        ref="numberValidateForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item>
          <div class="newItemBox">
            <div class="leftLabel" slot="label">
              <el-switch
                v-model="currentRow.insert_table.status"
                active-color="#13ce66"
              >
              </el-switch>
              <span class="labelSpan">插入数据表</span>
            </div>
            <el-input
              type="textarea"
              autosize
              :disabled="!currentRow.insert_table.status"
              placeholder="请用自然语言描述您要插入数据表的信息"
              v-model="currentRow.insert_table.content"
              autocomplete="off"
            ></el-input>
          </div>
        </el-form-item>
        <!-- 插入图 -->
        <el-form-item prop="appendValue">
          <div class="newItemBox">
            <div class="leftLabel" slot="label">
              <el-switch
                v-model="currentRow.insert_plot.status"
                active-color="#13ce66"
              >
              </el-switch>
              <span class="labelSpan">插入图形</span>
            </div>
            <el-input
              type="textarea"
              autosize
              :disabled="!currentRow.insert_plot.status"
              placeholder="请用自然语言描述 图形 的相关信息"
              v-model="currentRow.insert_plot.content"
              autocomplete="off"
            ></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item prop="appendValue">
          <div class="leftLabel" slot="label">
            <el-switch
              v-model="currentRow.insert_mermaid.status"
              active-color="#13ce66"
            >
            </el-switch>
            <span class="labelSpan">插入Mermaid图形</span>
          </div>
          <el-input
            type="textarea"
            autosize
            placeholder="请输入图的名称"
            v-model="currentRow.insert_mermaid.content"
            autocomplete="off"
          ></el-input>
        </el-form-item> -->
        <el-form-item prop="appendValue">
          <div class="newItemBox">
            <div class="leftLabel" slot="label">
              <el-switch
                v-model="currentRow.insert_latex_formula.status"
                active-color="#13ce66"
              >
              </el-switch>
              <span class="labelSpan">请用自然语言描述 插入公式</span>
            </div>
            <el-input
              type="textarea"
              :disabled="!currentRow.insert_latex_formula.status"
              autosize
              placeholder="请输入插入公式"
              v-model="currentRow.insert_latex_formula.content"
              autocomplete="off"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="appendValue">
          <div class="newItemBox">
            <div class="leftLabel" slot="label">
              <el-switch
                v-model="currentRow.insert_code.status"
                active-color="#13ce66"
              >
              </el-switch>
              <span class="labelSpan">插入代码段</span>
            </div>
            <div class="codeSelectInfo">
              <el-input
                type="textarea"
                autosize
                :disabled="!currentRow.insert_code.status"
                placeholder="请输入插入代码段"
                v-model="currentRow.insert_code.content"
                autocomplete="off"
              ></el-input>
              <!-- <el-select
                v-model="currentRow.insert_code.code_language"
                placeholder="请选择"
              >
                <el-option tag="q1" label="Python" value="Python"> </el-option>
                <el-option tag="q2" label="Java" value="Java"> </el-option>
                <el-option tag="q3" label="JavaScript" value="JavaScript">
                </el-option>
                <el-option tag="q4" label="C++" value="C++"> </el-option>
                <el-option tag="q5" label="C#" value="C#"> </el-option>
                <el-option tag="q5" label="PHP" value="PHP"> </el-option>
                <el-option tag="q5" label="Go" value="Go"> </el-option>
                <el-option tag="q5" label="Dart" value="Dart"> </el-option>
                <el-option tag="Rust" label="Rust" value="Rust"> </el-option>
                <el-option tag="SQL" label="SQL" value="SQL"> </el-option>
                <el-option tag="LaTeX" label="LaTeX" value="LaTeX"> </el-option>
                <el-option tag="Markdown" label="Markdown" value="Markdown">
                </el-option>
                <el-option tag="Swift" label="Swift" value="Swift"> </el-option>
                <el-option tag="Ruby" label="Ruby" value="Ruby"> </el-option>
                <el-option tag="Erlang" label="Erlang" value="Erlang">
                </el-option>
                <el-option tag="Erlang" label="Erlang" value="Erlang">
                </el-option>
                <el-option tag="Perl" label="Perl" value="Perl"> </el-option>
                <el-option tag="Kotlin" label="Kotlin" value="Kotlin">
                </el-option>
                <el-option tag="Swift" label="Swift" value="Swift"> </el-option>
              </el-select> -->
            </div>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFDialog">取 消</el-button>
        <el-button type="primary" @click="closeFDialog"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!--  -->
    <!-- <order-dialog
      :requestKey="requestKey"
      :payStatus="payStatus"
    ></order-dialog> -->
    <el-dialog
      title="论文字数"
      :visible.sync="sliderStatus"
      :show-close="false"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="sliderBox">
        <p class="sliderTitle">请选择您的论文字数</p>
        <el-slider
          v-model="paper_words"
          :min="1000"
          :max="25000"
          :marks="marks"
          :step="1000"
        >
        </el-slider>
        <p class="sliderText">
          温馨提示: 论文不会严格按照您选择的字数生成, 可能会有少量偏差!
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sliderStatus = false">取 消</el-button>
        <el-button type="primary" @click="saveOutline('reduce')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mitt from "mitt";
import { getToken } from "@/utils/auth"; //
import { mapGetters } from "vuex";
// 方法
import { getOrder, editLine } from "@/api/user";
import additional from "./step2/additional.vue";
import eventBus from "@/utils/eventBus";
import { outlineStatus } from "@/api/user";
import { down_url } from "@/api/paper";

import polling from "@/utils/get-order-detail.js";
import tips from "./step2/tips";
export default {
  name: "step2",
  data() {
    return {
      selectValue: "left", // 初始状态未选中任何卡片
      title: "艺术批评的时间作用及发展历程",
      descri: "1201 艺术学理论类",
      newlabel: "",
      loading: false,
      checked: false,
      paper_words: 800,
      defaultProps: {
        children: "sections",
        label: "title",
      },
      papers: [
        "5分钟前 论文《ZH培**********》生成成功",
        "30分钟前 论文《信息化**********》生成成功",
        "6分钟前 论文《互联网**********》生成成功",
        "14分钟前 论文《高温重**********》生成成功",
        "46分钟前 论文《超早期**********》生成成功",
        "48分钟前 论文《企业政**********》生成成功",
        "10分钟前 论文《why**********》生成成功",
        "52分钟前 论文《广西梧**********》生成成功",
        "16分钟前 论文《A企业**********》生成成功",
        "7分钟前 论文《传统农**********》生成成功",
        "37分钟前 论文《医药客**********》生成成功",
        "25分钟前 论文《农村留**********》生成成功",
        "56分钟前 论文《村务监**********》生成成功",
        "2分钟前 论文《铁路路**********》生成成功",
        "19分钟前 论文《浅析会**********》生成成功",
        "15分钟前 论文《《农村**********》生成成功",
        "20分钟前 论文《吃播广**********》生成成功",
        "26分钟前 论文《供电系**********》生成成功",
        "17分钟前 论文《浙江近**********》生成成功",
        "10分钟前 论文《传统家**********》生成成功",
        "58分钟前 论文《建设和**********》生成成功",
        "32分钟前 论文《篮球运**********》生成成功",
        "15分钟前 论文《从依附**********》生成成功",
        "29分钟前 论文《辱虐管**********》生成成功",
        "11分钟前 论文《浅谈高**********》生成成功",
        "41分钟前 论文《环境管**********》生成成功",
        "5分钟前 论文《网络时**********》生成成功",
        "42分钟前 论文《情感教**********》生成成功",
        "2分钟前 论文《沙棘在**********》生成成功",
        "42分钟前 论文《高校网**********》生成成功",
        "24分钟前 论文《论挑拨**********》生成成功",
        "45分钟前 论文《高中计**********》生成成功",
        "32分钟前 论文《计算机**********》生成成功",
        "13分钟前 论文《镜像优**********》生成成功",
        "2分钟前 论文《企业营**********》生成成功",
        "24分钟前 论文《心理测**********》生成成功",
        "25分钟前 论文《豫琼两**********》生成成功",
        "34分钟前 论文《中国上**********》生成成功",
        "3分钟前 论文《刑事诉**********》生成成功",
        "6分钟前 论文《高铁刚**********》生成成功",
        "28分钟前 论文《XSC**********》生成成功",
        "57分钟前 论文《藏羌彝**********》生成成功",
        "31分钟前 论文《RTA**********》生成成功",
        "3分钟前 论文《基于解**********》生成成功",
        "9分钟前 论文《远洋运**********》生成成功",
        "25分钟前 论文《大成企**********》生成成功",
        "54分钟前 论文《试论会**********》生成成功",
        "30分钟前 论文《羧甲基**********》生成成功",
        "35分钟前 论文《昆山市**********》生成成功",
        "27分钟前 论文《我国通**********》生成成功",
        "2分钟前 论文《PTN**********》生成成功",
        "27分钟前 论文《导线近**********》生成成功",
        "18分钟前 论文《魏晋诗**********》生成成功",
        "29分钟前 论文《基于广**********》生成成功",
        "30分钟前 论文《新型城**********》生成成功",
        "57分钟前 论文《沉浸式**********》生成成功",
        "14分钟前 论文《身份认**********》生成成功",
        "44分钟前 论文《伴髓外**********》生成成功",
        "3分钟前 论文《自治州**********》生成成功",
        "42分钟前 论文《城郊小**********》生成成功",
        "24分钟前 论文《浅谈会**********》生成成功",
        "45分钟前 论文《论腐败**********》生成成功",
        "4分钟前 论文《某抽水**********》生成成功",
        "24分钟前 论文《公共卫**********》生成成功",
        "12分钟前 论文《Res**********》生成成功",
        "40分钟前 论文《饭店经**********》生成成功",
        "28分钟前 论文《修正Z**********》生成成功",
        "49分钟前 论文《危机管**********》生成成功",
        "55分钟前 论文《基于P**********》生成成功",
        "25分钟前 论文《互联网**********》生成成功",
        "45分钟前 论文《乳腺癌**********》生成成功",
        "55分钟前 论文《浅析中**********》生成成功",
        "6分钟前 论文《大学生**********》生成成功",
        "22分钟前 论文《揭阳市**********》生成成功",
        "54分钟前 论文《棘轮式**********》生成成功",
        "20分钟前 论文《张三同**********》生成成功",
        "6分钟前 论文《KD公**********》生成成功",
        "17分钟前 论文《北京市**********》生成成功",
        "54分钟前 论文《孝感市**********》生成成功",
        "49分钟前 论文《B房地**********》生成成功",
        "22分钟前 论文《又查会**********》生成成功",
        "22分钟前 论文《企业资**********》生成成功",
        "42分钟前 论文《场景效**********》生成成功",
        "36分钟前 论文《广东省**********》生成成功",
        "21分钟前 论文《周京新**********》生成成功",
        "56分钟前 论文《互联网**********》生成成功",
        "44分钟前 论文《基于K**********》生成成功",
        "10分钟前 论文《道德生**********》生成成功",
        "38分钟前 论文《快乐教**********》生成成功",
        "55分钟前 论文《安徽建**********》生成成功",
        "30分钟前 论文《我国汽**********》生成成功",
        "39分钟前 论文《高效流**********》生成成功",
        "43分钟前 论文《低碳环**********》生成成功",
        "3分钟前 论文《山东省**********》生成成功",
        "13分钟前 论文《我国上**********》生成成功",
        "9分钟前 论文《亳州市**********》生成成功",
        "15分钟前 论文《我国商**********》生成成功",
        "42分钟前 论文《无人值**********》生成成功",
        "46分钟前 论文《云计算**********》生成成功",
        "41分钟前 论文《论农村**********》生成成功",
        "48分钟前 论文《梁宣龙**********》生成成功",
        "32分钟前 论文《浅谈抗**********》生成成功",
        "34分钟前 论文《商业银**********》生成成功",
        "50分钟前 论文《组织合**********》生成成功",
        "53分钟前 论文《小学卫**********》生成成功",
        "13分钟前 论文《浅析美**********》生成成功",
        "1分钟前 论文《微信平**********》生成成功",
        "31分钟前 论文《水中总**********》生成成功",
        "28分钟前 论文《LTE**********》生成成功",
        "16分钟前 论文《政府补**********》生成成功",
        "34分钟前 论文《买方报**********》生成成功",
        "46分钟前 论文《浅析铁**********》生成成功",
        "54分钟前 论文《针刀结**********》生成成功",
        "29分钟前 论文《旅游目**********》生成成功",
        "41分钟前 论文《枸杞药**********》生成成功",
        "40分钟前 论文《电信社**********》生成成功",
        "29分钟前 论文《澳門青**********》生成成功",
        "57分钟前 论文《上海链**********》生成成功",
        "22分钟前 论文《美的集**********》生成成功",
        "55分钟前 论文《试析我**********》生成成功",
        "22分钟前 论文《会计准**********》生成成功",
        "4分钟前 论文《山东省**********》生成成功",
        "12分钟前 论文《格林巴**********》生成成功",
        "44分钟前 论文《打造互**********》生成成功",
        "50分钟前 论文《对赌式**********》生成成功",
        "8分钟前 论文《关于北**********》生成成功",
        "21分钟前 论文《城市规**********》生成成功",
        "1分钟前 论文《美剧韩**********》生成成功",
        "41分钟前 论文《浅析我**********》生成成功",
        "16分钟前 论文《我国汽**********》生成成功",
        "55分钟前 论文《物联网**********》生成成功",
        "58分钟前 论文《顺丰冷**********》生成成功",
        "35分钟前 论文《福建省**********》生成成功",
        "23分钟前 论文《农业信**********》生成成功",
        "5分钟前 论文《湖南省**********》生成成功",
        "58分钟前 论文《“佛系**********》生成成功",
        "48分钟前 论文《支付宝**********》生成成功",
        "30分钟前 论文《游梁式**********》生成成功",
        "38分钟前 论文《贵阳市**********》生成成功",
        "42分钟前 论文《行政法**********》生成成功",
        "50分钟前 论文《转向分**********》生成成功",
        "56分钟前 论文《10k**********》生成成功",
        "52分钟前 论文《图式理**********》生成成功",
        "52分钟前 论文《翻译美**********》生成成功",
        "20分钟前 论文《基于游**********》生成成功",
        "6分钟前 论文《家族企**********》生成成功",
        "28分钟前 论文《维也纳**********》生成成功",
        "12分钟前 论文《内燃机**********》生成成功",
        "46分钟前 论文《政府补**********》生成成功",
        "41分钟前 论文《基于英**********》生成成功",
        "14分钟前 论文《藏羌彝**********》生成成功",
        "41分钟前 论文《国际化**********》生成成功",
        "21分钟前 论文《心理学**********》生成成功",
        "28分钟前 论文《王同业**********》生成成功",
        "14分钟前 论文《监狱罪**********》生成成功",
        "6分钟前 论文《城市与**********》生成成功",
        "32分钟前 论文《论不当**********》生成成功",
        "33分钟前 论文《郑州大**********》生成成功",
        "28分钟前 论文《基于队**********》生成成功",
        "1分钟前 论文《DY经**********》生成成功",
        "39分钟前 论文《专用盖**********》生成成功",
        "29分钟前 论文《论我国**********》生成成功",
        "28分钟前 论文《不同压**********》生成成功",
        "10分钟前 论文《OPP**********》生成成功",
        "21分钟前 论文《中小学**********》生成成功",
        "22分钟前 论文《我国企**********》生成成功",
        "8分钟前 论文《西安绿**********》生成成功",
        "40分钟前 论文《绩效评**********》生成成功",
        "16分钟前 论文《白云山**********》生成成功",
        "32分钟前 论文《传统的**********》生成成功",
        "46分钟前 论文《韦丹+**********》生成成功",
        "21分钟前 论文《抚顺市**********》生成成功",
        "17分钟前 论文《乳腺癌**********》生成成功",
        "3分钟前 论文《上市公**********》生成成功",
        "55分钟前 论文《信贷风**********》生成成功",
        "8分钟前 论文《现代插**********》生成成功",
        "31分钟前 论文《刑事诉**********》生成成功",
        "7分钟前 论文《浅析人**********》生成成功",
        "20分钟前 论文《用于双**********》生成成功",
        "31分钟前 论文《201**********》生成成功",
        "22分钟前 论文《我国小**********》生成成功",
        "14分钟前 论文《地区域**********》生成成功",
        "26分钟前 论文《薪酬制**********》生成成功",
        "9分钟前 论文《急性缺**********》生成成功",
        "51分钟前 论文《风险投**********》生成成功",
        "45分钟前 论文《大数据**********》生成成功",
        "17分钟前 论文《我国中**********》生成成功",
        "14分钟前 论文《3DS**********》生成成功",
        "52分钟前 论文《海洋环**********》生成成功",
        "35分钟前 论文《歌剧《**********》生成成功",
        "54分钟前 论文《江村站**********》生成成功",
        "30分钟前 论文《社会保**********》生成成功",
        "25分钟前 论文《政府补**********》生成成功",
        "3分钟前 论文《一带一**********》生成成功",
        "39分钟前 论文《基于随**********》生成成功",
        "11分钟前 论文《p2p**********》生成成功",
        "39分钟前 论文《美丽乡**********》生成成功",
        "49分钟前 论文《武汉市**********》生成成功",
        "26分钟前 论文《三语法**********》生成成功",
        "45分钟前 论文《律师事**********》生成成功",
        "39分钟前 论文《汽车悬**********》生成成功",
        "31分钟前 论文《毕业论**********》生成成功",
        "32分钟前 论文《论文图**********》生成成功",
        "32分钟前 论文《基于典**********》生成成功",
        "16分钟前 论文《高中思**********》生成成功",
        "35分钟前 论文《财务共**********》生成成功",
        "26分钟前 论文《深度学**********》生成成功",
        "36分钟前 论文《加味柴**********》生成成功",
        "12分钟前 论文《浅析尹**********》生成成功",
        "11分钟前 论文《助力灵**********》生成成功",
        "37分钟前 论文《零售连**********》生成成功",
        "6分钟前 论文《结构化**********》生成成功",
        "56分钟前 论文《浅析贵**********》生成成功",
        "33分钟前 论文《城镇企**********》生成成功",
        "57分钟前 论文《水土资**********》生成成功",
        "57分钟前 论文《一例胆**********》生成成功",
        "51分钟前 论文《东方电**********》生成成功",
        "53分钟前 论文《食管鳞**********》生成成功",
        "19分钟前 论文《融媒体**********》生成成功",
        "57分钟前 论文《关于宁**********》生成成功",
        "38分钟前 论文《南开大**********》生成成功",
        "45分钟前 论文《授权型**********》生成成功",
        "56分钟前 论文《农产品**********》生成成功",
        "8分钟前 论文《从淘宝**********》生成成功",
        "52分钟前 论文《浅析公**********》生成成功",
        "44分钟前 论文《浅议个**********》生成成功",
        "24分钟前 论文《论创意**********》生成成功",
        "53分钟前 论文《应用几**********》生成成功",
        "36分钟前 论文《榆林市**********》生成成功",
        "33分钟前 论文《3D技**********》生成成功",
        "49分钟前 论文《基于生**********》生成成功",
        "50分钟前 论文《产业园**********》生成成功",
        "32分钟前 论文《萍乡市**********》生成成功",
        "43分钟前 论文《供电系**********》生成成功",
        "20分钟前 论文《利润分**********》生成成功",
        "58分钟前 论文《网络时**********》生成成功",
        "50分钟前 论文《装饰风**********》生成成功",
        "45分钟前 论文《思维导**********》生成成功",
        "54分钟前 论文《应用工**********》生成成功",
        "8分钟前 论文《微量液**********》生成成功",
        "29分钟前 论文《浅议我**********》生成成功",
        "19分钟前 论文《第三方**********》生成成功",
        "25分钟前 论文《公路桥**********》生成成功",
        "19分钟前 论文《三维水**********》生成成功",
        "49分钟前 论文《黑苏两**********》生成成功",
        "9分钟前 论文《友宝无**********》生成成功",
        "39分钟前 论文《新媒体**********》生成成功",
        "38分钟前 论文《论一带**********》生成成功",
        "11分钟前 论文《秦汉时**********》生成成功",
        "36分钟前 论文《后张法**********》生成成功",
        "5分钟前 论文《保险大**********》生成成功",
        "12分钟前 论文《组织承**********》生成成功",
        "4分钟前 论文《京津冀**********》生成成功",
        "4分钟前 论文《政府主**********》生成成功",
        "5分钟前 论文《农村小**********》生成成功",
        "41分钟前 论文《馆陶县**********》生成成功",
        "20分钟前 论文《碳封装**********》生成成功",
        "6分钟前 论文《我国农**********》生成成功",
        "54分钟前 论文《格力电**********》生成成功",
        "29分钟前 论文《企业并**********》生成成功",
        "25分钟前 论文《巴布尔**********》生成成功",
        "53分钟前 论文《妊娠合**********》生成成功",
        "34分钟前 论文《B2B**********》生成成功",
        "12分钟前 论文《十九大**********》生成成功",
        "20分钟前 论文《湘西精**********》生成成功",
        "31分钟前 论文《中国人**********》生成成功",
        "50分钟前 论文《新冠疫**********》生成成功",
        "46分钟前 论文《组合机**********》生成成功",
        "12分钟前 论文《基于物**********》生成成功",
        "17分钟前 论文《我国汽**********》生成成功",
        "27分钟前 论文《浅论沈**********》生成成功",
        "4分钟前 论文《人民币**********》生成成功",
        "39分钟前 论文《论民事**********》生成成功",
        "53分钟前 论文《异步电**********》生成成功",
        "37分钟前 论文《计算机**********》生成成功",
        "52分钟前 论文《湘西精**********》生成成功",
        "36分钟前 论文《HAC**********》生成成功",
        "13分钟前 论文《RCE**********》生成成功",
        "19分钟前 论文《会计谨**********》生成成功",
        "6分钟前 论文《H农业**********》生成成功",
        "43分钟前 论文《大学生**********》生成成功",
        "14分钟前 论文《燃煤锅**********》生成成功",
        "5分钟前 论文《分布式**********》生成成功",
        "7分钟前 论文《岚山港**********》生成成功",
        "53分钟前 论文《中国体**********》生成成功",
        "12分钟前 论文《海天味**********》生成成功",
        "41分钟前 论文《健身房**********》生成成功",
        "5分钟前 论文《新时期**********》生成成功",
        "49分钟前 论文《银行客**********》生成成功",
        "36分钟前 论文《体育舞**********》生成成功",
        "11分钟前 论文《李宁运**********》生成成功",
        "37分钟前 论文《泰州市**********》生成成功",
        "39分钟前 论文《逆向物**********》生成成功",
        "25分钟前 论文《女性董**********》生成成功",
        "26分钟前 论文《现代物**********》生成成功",
        "43分钟前 论文《国民经**********》生成成功",
        "52分钟前 论文《现代建**********》生成成功",
        "36分钟前 论文《201**********》生成成功",
        "31分钟前 论文《南宁圣**********》生成成功",
      ],
      parentHeight: 0,
      marks: {
        5000: "5000字",
        8000: "8000字",
        10000: "10000字",
        15000: "15000字",
        20000: {
          style: {
            color: "#1989FA",
          },
          label: this.$createElement("strong", "20000字"),
        },
        25000: {
          style: {
            color: "#E6A23C",
          },
          label: this.$createElement("strong", "25000字"),
        },
      },
      numberValidateForm: {
        appendValue: "",
        appendContent: "",
        insertPosition: "after",
      },
      selectForm: {
        data1: "",
        checked: "",
      },
      outline: [],
      timestamp: null,
      paperPercentage: 0,
      imgExcelSetStatus: false,

      editData: {}, // 被选中的节点的数据
      editParentData: {}, // 被选中节点的父节点
      editStatus: false,
      appendLevel: 1, //新增元素的当前章节
      statementDialogVisible: false,
      currentRow: {
        insert_code: {
          status: false,
          content: "",
        },
        insert_mermaid: {
          status: false,
          content: "",
        },
        insert_latex_formula: {
          status: false,
          content: "",
        },
        insert_table: {
          status: false,
          content: "",
        },
        insert_plot: {
          status: false,
          content: "",
        },
      },
      idCount: 1,
      // 计算当前是几级大纲
      maxLevel: 2,
      out_trade_no: "",
      insertSibling: false, // true:插入到同级 false:插入到下一级
      isPolling: false, // 是否正在进行轮询
      sliderStatus: false,
    };
  },
  components: {
    additional,
    tips,
  },
  props: {
    outlineData: {
      type: Array,
      require: true,
    },
  },
  watch: {
    outlineData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.outline = val;
        this.generateIndexes(this.outline);

        this.selectValue = "left"; // 初始状态未选中任何卡片
      },
    },
    loading: {
      immediate: true,
      handler(val) {
        this.updateParentHeight();
      },
    },
  },

  created() {
    this.generateIndexes(this.outline);

    // this.$log(this.outline, "outline");
  },

  computed: {
    // 计算属性
    ...mapGetters([
      "requestForm",
      "additionalList",
      "outlineVersion",
      "homeData",
      "device",
    ]),
  },
  methods: {
    downLoadLine() {
      eventBus.emit("showDownOutline", this.requestForm);
      // let data = {
      //   key1: this.requestForm.key,
      // };
      // down_url(data).then((res) => {
      //   this.$log(res);
      //   if (res.result.down_url) {
      //     // downloadFile(res.result.down_url);
      //     // const link = document.createElement("a");
      //     // link.href = res.result.down_url;
      //     // // Set the download attribute to suggest a filename
      //     // link.download = "download";
      //     // // Append the link to the body
      //     // document.body.appendChild(link);
      //     // // Programmatically click the link to trigger the download
      //     // link.click();
      //     // // Remove the link from the document
      //     // document.body.removeChild(link);
      //   }
      // });
    },
    showSlider() {
      this.sliderStatus = true;
      this.paper_words = 1000;
      // 生成正文
    },
    // 重新生成大纲
    reloadOutline() {
      eventBus.emit("reloadOutline", this.outlineVersion);
    },
    // 先保存再调用AI更新
    updateParentHeight() {
      // 获取元素高度

      this.$nextTick(() => {
        if (this.$refs.outlineParent) {
          this.parentHeight = this.$refs.outlineParent.offsetHeight;
        }
      });
    },
    saveOutlineTwo() {
      this.loading = true;
      let data = {
        title: this.requestForm.title,
        key1: this.requestForm.key || this.requestForm.key1,
        outline: {
          outline: this.outline,
        },
      };
      data.aitype = false;
      editLine(data)
        .then((res) => {
          this.saveOutline("aitype");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    saveOutline(status) {
      //关不字数选择弹窗
      this.sliderStatus = false;
      let data = {
        title: this.requestForm.title,
        key1: this.requestForm.key || this.requestForm.key1,
        outline: {
          outline: this.outline,
        },
      };
      if (status == "aitype") {
        zhuge.track(`AI帮写`, {
          大纲key: this.requestForm.key || this.requestForm.key1,
          所选学历: this.requestForm.type,
          大纲字数: this.requestForm.word_count,
          大纲类型: this.requestForm.product,
        });
        data.aitype = true;
      } else {
        zhuge.track(`编辑大纲`, {
          大纲key: this.requestForm.key || this.requestForm.key1,
          所选学历: this.requestForm.type,
          大纲字数: this.requestForm.word_count,
          大纲类型: this.requestForm.product,
        });
        data.aitype = false;
      }
      editLine(data).then((res) => {
        // this.$message({
        //   type: "success",
        //   message: "保存大纲成功!",
        // });
        // 保存成功清除弹窗内容
        // this.$refs.numberValidateForm.resetFields();

        // 进入轮询方法,
        if (status == "aitype") {
          let _this = this;
          setTimeout(() => {
            _this.getList();
          }, 5000);
        } else {
          this.reloadSave(status);
        }
        // 刷新大纲
      });
    },
    getList() {
      polling({ key: this.requestForm.key || this.requestForm.key1 })
        .then((res) => {
          if (res == "生成失败") {
            this.$message({
              type: "error",
              message: "生成失败,请稍后再试!",
            });
          } else {
            this.outline = res;
            this.generateIndexes(this.outline);
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "AI帮写已超时,请稍后再试!",
          });
        });
    },

    reloadSave(status) {
      let data = {
        key: this.requestForm.key || this.requestForm.key1,
      };
      outlineStatus(data).then((res) => {
        this.outline = res.result.outline.outline;
        this.generateIndexes(this.outline);

        // 保存大纲输入信息
        if (status == "reduce") {
          // 生成全文
          if (this.device === "mobile") {
            this.$message({
              type: "warning",
              // message: "手机端暂不支持生成正文!",
              message: "推荐您使用电脑生成全文！",
            });
            // return false;
          }
          this.generateForm();
        }
      });
    },
    showImgF(item) {
      Ming("item", item);
      this.imgExcelSetStatus = true;
      this.currentRow = item;
    },
    addPageOne() {
      this.outline.push({
        id: new Date().getTime(),
        level: 1,
        title: "请修改标题",
        sections: [
          {
            id: new Date().getTime() - 100,
            title: "请修改标题",
            content: "请修改标题",
            level: 2,
            insert_code: {
              status: false,
              content: "",
            },
            insert_mermaid: {
              status: false,
              content: "",
            },
            insert_latex_formula: {
              status: false,
              content: "",
            },
            insert_table: {
              status: false,
              content: "",
            },
            insert_plot: {
              status: false,
              content: "",
            },
          },
        ],
      });
      this.generateIndexes(this.outline);
    },
    generateIndexes(nodes, parentIndex = "", level = 1) {
      let counter = 1;
      nodes.forEach((node) => {
        const index = parentIndex
          ? `${parentIndex}-${counter++}`
          : `${counter++}`;
        this.$set(node, "index", index);
        // 设置 level 属性
        this.$set(node, "level", level);
        if (!node.id) {
          const uniqueId = "node" + this.idCount++;
          this.$set(node, "id", uniqueId);
        }
        // if (level > this.maxLevel) {
        //   this.maxLevel = level;
        // }
        if (node.sections && node.sections.length > 0) {
          this.generateIndexes(node.sections, index, level + 1);
        }
      });
    },

    allowDrag(draggingNode) {
      // 顶层默认分组不允许拖拽
      if (draggingNode.data.id === 1) {
        return false;
      } else {
        return true;
      }
      // return draggingNode.data.apiGroupName.indexOf('三级 3-2-2') === -1
    },
    updateApiGroup(data1) {
      Ming("1014---当前大纲对象123:", data1);
      Ming("1014---this.outline:", this.outline);
      // this.saveOutline();

      let data = {
        title: this.requestForm.title,
        key1: this.requestForm.key || this.requestForm.key1,
        outline: {
          outline: data1,
        },
        aitype: false,
      };
      editLine(data).then((res) => {
        // this.$message({
        //   type: "success",
        //   message: "保存大纲成功!",
        // });
        let _this = this;
        setTimeout(() => {
          _this.reloadSave();
        }, 500);
        // 保存成功清除弹窗内容
        // this.$refs.numberValidateForm.resetFields();
        // 进入轮询方法,
        // 刷新大纲
      });
    },
    appendShow(node, data) {
      this.editData = data;
      if (this.numberValidateForm.hasOwnProperty("insertPosition")) {
        delete this.numberValidateForm.insertPosition;
      }
      this.insertSibling = false;
      this.editStatus = true;
      this.$nextTick(() => {
        // this.$refs.numberValidateForm.resetFields();
        this.resetNumberForm();
      });
    },
    resetNumberForm() {
      let numberValidateForm = {
        appendValue: "",
        appendContent: "",
        insertPosition: "after",
      };
      this.numberValidateForm = { ...numberValidateForm };
    },
    appendShowSibling(node, data) {
      //  Ming("1030---node和data:", node, data, data.index);

      this.appendLevel = data.level;
      if (data.level == 1) {
        this.editData = data;
      } else {
        this.editData = data;
        this.editParentData = node.parent.data;
      }

      this.editStatus = true;
      this.$set(this.numberValidateForm, "insertPosition", "after");
      this.insertSibling = true;
      this.$nextTick(() => {
        // this.$refs.numberValidateForm.resetFields();
        this.resetNumberForm();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.appendLevel == 1) {
            this.appendOneLevel();
          } else {
            this.appendSibling();
          }
        } else {
          return false;
        }
      });
    },
    appendOneLevel() {
      let oneLevelData = {
        chapter_num: "",
        title: this.numberValidateForm.appendValue,
        sections: [
          {
            title: "请修改标题",
            summary: "请修改章节内容",
            insert_code: {
              status: false,
              content: "",
            },
            insert_mermaid: {
              status: false,
              content: "",
            },
            insert_latex_formula: {
              status: false,
              content: "",
            },
            insert_table: {
              status: false,
              content: "",
            },
            insert_plot: {
              status: false,
              content: "",
            },
          },
        ],
      };
      let appendIndex = this.editData.index;
      // this.$set(this.outline,)
      this.outline.splice(appendIndex, 0, oneLevelData);
      this.updateApiGroup(this.outline);
      this.$refs.numberValidateForm.resetFields();
      this.editStatus = false;
    },
    appendSibling(parentNodeData, data) {
      data = this.editData;
      parentNodeData = this.editParentData;
      var timestamp = new Date().getTime();
      const newChild = {
        id: timestamp,
        isEdit: 0,
        apiGroupName: "T" + timestamp,
        title: this.numberValidateForm.appendValue,
        summary: this.numberValidateForm.appendContent
          ? this.numberValidateForm.appendContent
          : "",
        insert_code: {
          status: false,
          content: "",
        },
        insert_mermaid: {
          status: false,
          content: "",
        },
        insert_latex_formula: {
          status: false,
          content: "",
        },
        insert_table: {
          status: false,
          content: "",
        },
        insert_plot: {
          status: false,
          content: "",
        },
      };
      console.log("dddddd", newChild);
      // 只判断了 after情况
      if (this.numberValidateForm.insertPosition == "after") {
        const targetIndex = parentNodeData.sections.findIndex(
          (item) => item.index === data.index
        );
        if (targetIndex !== -1) {
          parentNodeData.sections.splice(targetIndex + 1, 0, newChild);
        }
      } else if (this.numberValidateForm.insertPosition == "before") {
        const targetIndex = parentNodeData.sections.findIndex(
          (item) => item.index === data.index
        );
        if (targetIndex !== -1) {
          parentNodeData.sections.splice(targetIndex, 0, newChild);
        }
      }
      console.log(
        "this.outline123123",
        JSON.stringify(this.outline[0].sections[1])
      );

      // parentNodeData.sections.push(newChild);
      // this.updateApiGroup(JSON.parse(JSON.stringify(this.outline)));
      this.generateIndexes(this.outline);
      let _this = this;
      setTimeout(() => {
        _this.updateApiGroup(this.outline);
        _this.editStatus = false;
      }, 100);
    },

    remove(node, data) {
      const parent = node.parent;
      const sections = parent.data.sections || parent.data;
      const index = sections.findIndex((d) => d.id === data.id);
      sections.splice(index, 1);
      this.updateApiGroup(this.outline);
    },
    edit(node, data) {
      this.$set(data, "isEdit", 1);
      this.newlabel = data.title;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    submitEdit(node, data) {
      if (data.title == this.newlabel) {
        this.newlabel = "";
        this.$set(data, "isEdit", 0);
      } else {
        this.$set(data, "label", this.newlabel);
        this.newlabel = "";
        this.$set(data, "isEdit", 0);
        this.onlySave();
      }
    },
    textF() {
      this.statementDialogVisible = true;
    },
    saveSummary: _.debounce(function () {
      this.onlySave();
    }, 4000),
    onlySave() {
      let data = {
        title: this.requestForm.title,
        key1: this.requestForm.key || this.requestForm.key1,
        outline: {
          outline: this.outline,
        },
      };
      zhuge.track(`编辑大纲`, {
        大纲key: this.requestForm.key || this.requestForm.key1,
        所选学历: this.requestForm.type,
        大纲字数: this.requestForm.word_count,
        大纲类型: this.requestForm.product,
      });
      editLine(data)
        .then((res) => {})
        .catch((err) => {
          this.loading = false;
        });
    },
    // 根据type获取items
    getItems(type) {
      //       1. 用户勾选毕业论文，items中的product_id需要把1、6、7、9都传
      // 2. 用户勾选结课论文，items中的product_id需要把1、6、7、9都传
      // 3. 用户勾选开题报告，items中的product_id只传6
      // 4. 用户勾选任务书，items中的product_id只传7
      // 5. 用户勾选文献综述，items中的product_id只传16
      // 6. 增加type、product、word_count入参，不需要传字数的就传0
      let ownItem = [];
      let itemKai = {
        id: "6",
        product_id: "6",
        intro: "",
        is_supported: true,
        name: "开题报告",
        quantity: 1, // 数量
        now_Price: 0,
        price: 4.9,
      };
      let itemRen = {
        id: "7",
        product_id: "7",
        quantity: 1, // 数量
        intro: "",
        is_supported: true,
        name: "任务书",
        now_Price: 0,
        price: 4.9,
      };
      let ownProduct = this.requestForm.product;
      if (ownProduct == "毕业论文" || ownProduct == "结课论文") {
        ownItem = [
          {
            product_id: "1", //正文id
            quantity: 1, // 数量
            price: 149.85, //价格
          },
        ];
      }
      if (ownProduct == "开题报告") {
        ownItem = [itemKai];
      }
      if (ownProduct == "任务书") {
        ownItem = [itemRen];
      }
      if (ownProduct == "文献综述") {
        ownItem = [
          {
            id: "16",
            product_id: "16",
            intro: "",
            name: "文献综述",
            quantity: 1, // 数量
          },
        ];
      }

      return ownItem;
    },
    // 生成全文
    generateForm() {
      window.zhuge.track("生成正文", {
        // title: this.requestForm.title,
        语言: this.requestForm.language,
        科目: this.requestForm.field && this.requestForm.field[1],
        论文类型: this.requestForm.type,
        论文水平: this.requestForm.paper_level,
        论文字数: this.requestForm.word_count,
      });
      if (!this.checked) {
        this.statementDialogVisible = true;
      } else {
        const hasToken = getToken();
        // 判断item2传参
        let ownItem = this.getItems();
        if (hasToken) {
          let data = {
            user_id: 1, // 固定传一
            payment_method: "alipay", // 支付方式
            total_amount: 149.85, // 总价
            pay_type: this.selectValue == "left" ? "PAY_ALL" : "PAY_STAGES",
            key: this.requestForm.key || this.requestForm.key1, // 大纲的key
            product: this.requestForm.product, // 大纲的key
            type: this.requestForm.type, // 大纲的key
            word_count: this.requestForm.word_count, // 大纲的key
            items: ownItem,
          };
          let priceList = this.homeData.category_list;
          let result = priceList.find(
            (item) => item.name === this.requestForm.type
          );
          this.$log(result, result.total_price);
          data.total_amount = result.total_price;
          if (data.pay_type == "PAY_STAGES") {
            data.items = [
              {
                product_id: "1", //正文id
                quantity: 1, // 数量
                price: 149.85, //价格
              },
            ];
          }
          // this.getDetail(34);
          getOrder(data)
            .then((res) => {
              //  保存订单信息 用于下载展示
              let order = {
                out_trade_no: res.result.out_trade_no,
                pay_amount: res.result.pay_amount,
                pay_link: res.result.pay_link,
                original_price: res.result.original_amount,
                pay_type: data.pay_type,
                payment_method: data.payment_method,
                key: data.key,
                product: this.requestForm.product, // 大纲的key
                type: this.requestForm.type, // 大纲的key
                word_count: this.requestForm.word_count, // 大纲的key
                order_type: res.result.order_type, // 判断是否能切换
                items: data.items,
                discounted_price: res.result.discounted_price, // 优惠金额
                is_discount: res.result.is_discount, // 优惠金额
              };
              this.$store.dispatch("app/toggleCurrentOrder", order);

              eventBus.emit("showEmitPaypopup", {
                requestKey: res.result.out_trade_no,
                payStatus: 2,
                paperPercent: 0,
              });
              // 打开生成论文弹窗
              // eventBus.emit("showEmitPaperDialog", {
              //   requestKey: res.result.out_trade_no,
              //   payStatus: 2,
              //   paperPercent: 0,
              // });

              // this.requestKey = "5e0c2e41-e865-4269-a02d-fb0b919cd822";
              // this.requestKey = "15b41aa3-ec35-45e9-ac6b-bfe3b7ba3d8d";
              // if (payUrl) {
              //   window.open(payUrl, "_blank");
              // }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "订单生成失败, 请联系客服重试!",
              });
            });
        }
      }
    },

    agreeGenerate() {
      // 关闭确认弹窗
      this.statementDialogVisible = false;
      // 勾选"我已阅读并同意...."
      this.checked = true;
      this.reloadSave("reduce");
      // 接下来弹出付款二维码,走付款流程
    },
    handleDragStart(node, ev) {
      Ming("drag start");
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      Ming("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      Ming("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      Ming("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      Ming("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      Ming("tree drop: ", dropNode.label, dropType);
      this.generateIndexes(this.outline);
    },
    allowDrop(draggingNode, dropNode, type) {
      return true;
    },
    numberToChinese(num) {
      const chineseNums = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ];
      const units = ["", "十", "百", "千", "万", "十", "百", "千", "亿"];

      let result = "";
      let strNum = num.toString();
      let len = strNum.length;

      for (let i = 0; i < len; i++) {
        let digit = parseInt(strNum[i]);
        if (digit !== 0) {
          result += chineseNums[digit] + units[len - i - 1];
        } else if (result && result[result.length - 1] !== "零") {
          result += chineseNums[digit];
        }
      }

      // 处理特殊情况，如“一百零一”而不是“一百一”
      result = result.replace(/零+/g, "零");
      result = result.replace(/零([十百千])/, "$1");

      // 去掉末尾的零
      result = result.replace(/零+$/, "");

      // 特殊处理“十”和“十一”
      if (result === "十") {
        result = "十";
      } else if (result.startsWith("一十")) {
        result = result.replace("一十", "十");
      }

      return result;
    },
    allowDrag(draggingNode) {
      Ming(draggingNode.data);
      return draggingNode.data.title.indexOf("hahah") === -1;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    closeDialog() {
      this.resetForm();
      this.resetForm("numberValidateForm");
      this.editStatus = false;
    },
    closeFDialog() {
      this.onlySave();
      this.imgExcelSetStatus = false;
    },
    resetForm() {
      this.appendValue = "";
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
@import "@/styles/variables.scss";
@import "./index.scss";

::v-deep .el-loading-spinner {
  top: 20% !important;
}
.el-loading-spinner {
  top: 20% !important;
}
::v-deep .el-tree-node__children {
  background: #f7f9fa;
}
.btnList {
  display: flex;
}
.btnStarDe {
  width: 20px;
  height: 20px;
  position: relative;
  top: -6px;
  img {
    width: 100%;
    height: 100%;
  }
}
.btnStarBorder {
  color: #0066ff;
  background: linear-gradient(#fff, #fff) padding-box,
    /* 背景 */ linear-gradient(45deg, #e0b0ff, #00feff, #90ff7b, #e0b0ff)
      border-box; /* 边框 */
  border: 2px solid transparent; /* 透明边框 */
  border-radius: 30px; /* 圆角 */
  cursor: pointer;
  text-decoration: none;
  position: relative;
}
.bgDeBtn {
  background-image: linear-gradient(180deg, #009fff 11%, #0066ff 89%);
  box-shadow: inset 0 2px 4px 0 #6cb6ff, inset 0 6px 5px 0 #ffffffa6,
    inset 0 -2px 3px 0 #7eb2ff, inset 0 -3px 6px 0 #0052cc;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
}
</style>
