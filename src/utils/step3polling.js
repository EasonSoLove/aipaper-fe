import { paper_status } from "@/api/paper";
import store from "@/store";

let activePollingInstance = null; // 存储当前活跃的轮询实例

/**
 * 通用轮询方法
 * @param {Function} callback 轮询执行的业务逻辑（返回 Promise）
 * @param {Number} delay 轮询间隔
 * @param {Number} maxRetries 最大重试次数
 * @param {Number} timeout 超时时间
 * @returns {Object} { start, stop } 控制轮询的接口
 */
function createIntervalPolling(
  callback,
  delay = 20000,
  maxRetries = 5,
  timeout = 120000
) {
  let timer = null;
  let isCancelled = false;
  let retries = 0;

  const stop = () => {
    isCancelled = true;
    clearTimeout(timer);
    console.log("轮询已停止");
  };

  const start = () => {
    isCancelled = false;

    const loop = async () => {
      if (isCancelled) return;

      try {
        await callback(stop);
        retries = 0; // 成功时重置重试次数
        timer = setTimeout(loop, delay);
      } catch (err) {
        retries += 1;
        if (retries >= maxRetries) {
          console.error("轮询达到最大重试次数");
          stop();
        } else {
          console.error("轮询出错，重试中：", err);
          timer = setTimeout(loop, delay);
        }
      }
    };

    loop();

    // 设置总超时
    setTimeout(() => {
      if (!isCancelled) {
        console.error("轮询超时");
        stop();
      }
    }, timeout);
  };

  return { start, stop };
}

/**
 * 业务轮询方法
 * @param {Object} data 请求数据
 * @param {Function} onSuccess 成功后的回调函数，接收 res.result
 * @returns {Object} { start, stop } 控制轮询的接口
 */
function createPaperPolling(data, onSuccess) {
  return createIntervalPolling(
    async (stop) => {
      const res = await paper_status(data); // 调用接口
      console.log("re statusstatusstatus", res);
      if (res.result.paper_stage == 1 || res.result.paper_stage == 0) {
        if (res.result.task_info_list && res.result.task_info_list.length > 0) {
          // let data = {
          //   out_trade_no: "9d4eebbf-3d87-432b-bb88-d53475a2df00",
          //   paper_stage: 1,
          //   task_info_list: [
          //     {
          //       task_content:
          //         "### 确认沙箱环境是否就绪：\n#### 1. 算力资源分配完成！\n#### 2. 沙箱环境初始化完成！\n#### 3. 大纲内容检查完成！\n#### 4. 所有参考文献已阅读并学习完成！\n沙箱环境准备就绪，接下来我将依据您提供的大纲和参考文献，按照小节顺序为您撰写全文，最终将内容整理成PDF和Word文档文件提供给您。任务耗时随着字数、章节内容的增多会略有延长，请您耐心等待！\n",
          //       task_is_output: true,
          //       task_node: "init",
          //       task_reasoner:
          //         "您好！我已收到您的请求，您希望我根据您提供的大纲和参考文献，撰写一篇标题为：女性主义哲学对传统伦理学的批判的文章。\n\n#### 1. 研究领域：哲学类\n#### 2. 论文语言：中文\n#### 3. 学业类型：本科\n#### 4. 字数：5000\n#### 5. 论文水平：初级\n\n### 正在计算所需算力资源，为您初始化沙箱环境...\n正在执行命令 ```mkdir -p /home/ubuntu/paper_11938```\n\n正在创建文件 ```paper_11938/todo.md```\n\n### 算力资源分配完成，为确保论文数据隐私，已为您初始化独立的沙箱环境！\n\n### 正在检查大纲内容...\n## 第一章 引言\n ### 1.1 研究背景与意义\n 女性主义哲学在批判传统伦理学中的性别偏见方面提出了重要的理论贡献。传统伦理学中长期存在的男权主义和性别偏见问题，严重影响了女性的独立发展和社会地位。通过系统梳理和分析女性主义哲学的研究进展，可以揭示其对传统伦理学的批判和创新。此研究旨在通过探讨女性主义哲学对传统伦理学的批判，揭示性别偏见和男权主义的影响，并提出关怀伦理学的新视角。\n## 第一章 引言\n ### 1.2 本研究的主要贡献和创新点\n 本研究的主要贡献在于系统地提出女性主义哲学对传统伦理学的批判，揭示其中的性别偏见和男权主义的影响。创新点包括强调关怀伦理学在女性主义伦理学中的重要性，提出新的伦理学视角；结合女性主义科学哲学和语言性别研究，提出多学科交叉的批判方法。这些创新点不仅丰富了女性主义哲学的研究内容，也为传统伦理学的改进提供了新的思路。\n## 第二章 文献综述\n ### 2.1 研究理论基础\n 本节将介绍女性主义哲学的基本理论，包括性别差异理论、关怀伦理学和女性主义科学哲学等。通过对这些理论的介绍，展示其在批判传统伦理学中的作用和意义。特别是伊丽格瑞的性差异理论，强调了性别差异的基础性和普遍性，对传统伦理学中的性别偏见进行了深刻批判。\n## 第二章 文献综述\n ### 2.2 研究现状\n 本节将对国内外女性主义哲学和伦理学的研究现状进行系统梳理和分析。通过文献综述和定量统计分析，揭示研究进展和变化。特别关注关怀伦理学的发展，展示其在生命伦理学、生态伦理学和政治伦理学中的应用和影响。结合具体数据，如2006—2010年间在中国学术期刊网络总库中以“女性主义”为关键词进行搜索，共有文章3700余篇，以“女性主义哲学”为主题搜索的结果为180余篇。\n## 第二章 文献综述\n ### 2.3 本研究的创新点\n 本节将详细阐述本研究的创新点，包括系统批判传统伦理学中的性别偏见和男权主义，强调关怀伦理学的新视角，结合女性主义科学哲学和语言性别研究，提出多学科交叉的批判方法。这些创新点不仅丰富了女性主义哲学的研究内容，也为传统伦理学的改进提供了新的思路。\n## 第三章 研究方法\n ### 3.1 文献综述\n 本节将介绍文献综述的方法，通过系统梳理和分析国内外女性主义哲学和伦理学的研究进展，揭示其对传统伦理学的批判。重点介绍国内女性主义哲学研究的新进展，包括2006—2011年期间国内女性主义哲学研究的主要内容和学科建设努力。\n## 第三章 研究方法\n ### 3.2 定量统计分析\n 本节将介绍定量统计分析的方法，通过数据分析揭示女性主义哲学和伦理学的研究趋势。结合具体数据，如在中国知网中以“关怀伦理”作为主题词进行检索，2006年有134篇相关论文，2011年增加到193篇，展示关怀伦理学的发展趋势。\n## 第三章 研究方法\n ### 3.3 批判分析\n 本节将介绍批判分析的方法，结合女性主义科学哲学和语言性别研究，对传统伦理学中的性别偏见和男权主义进行深入批判。重点分析男权主义对传统伦理学的影响，揭示其对女性独立发展和社会地位的严重约束。\n## 第四章 研究结果与讨论\n ### 4.1 女性主义哲学对传统伦理学的批判\n 本节将详细阐述女性主义哲学对传统伦理学的批判，揭示其中的性别偏见和男权主义的影响。结合具体案例，展示女性主义哲学如何通过关怀、情感和关系的伦理学新视角，对传统伦理学进行深刻批判。\n## 第四章 研究结果与讨论\n ### 4.2 关怀伦理学的新视角\n 本节将介绍关怀伦理学的新视角，强调其在女性主义伦理学中的重要性。通过具体案例，展示关怀伦理学如何在生命伦理学、生态伦理学和政治伦理学中发挥作用，提出新的伦理学视角。\n## 第四章 研究结果与讨论\n ### 4.3 多学科交叉的批判方法\n 本节将介绍多学科交叉的批判方法，结合女性主义科学哲学和语言性别研究，对传统伦理学中的性别偏见和男权主义进行深入批判。展示这些多学科交叉的批判方法如何为传统伦理学的改进和创新提供新的思路。\n## 第五章 结论与展望\n ### 5.1 研究结论\n 本节将总结研究结果，女性主义哲学通过对传统伦理学的系统批判，揭示了其中的性别偏见和男权主义的影响。关怀伦理学在女性主义伦理学中的重要性得到强调，提出了新的伦理学视角。结合女性主义科学哲学和语言性别研究，提出了多学科交叉的批判方法，为传统伦理学的改进和创新提供了重要参考。\n## 第五章 结论与展望\n ### 5.2 研究局限与未来展望\n 本节将讨论研究局限和未来展望。研究局限包括文献综述和批判分析的方法可能存在主观性，需进一步验证；研究主要基于文献数据，缺乏实证研究支持；研究范围主要集中在中国，需扩展到更广泛的国际视角。未来研究方向包括进一步验证研究结果，结合实证研究，拓展国际视角，深入探讨女性主义哲学对传统伦理学的批判和创新。\n\n大纲内容检查无误！\n\n### 正在阅读并学习参考文献...\n- [1] 参考文献：国内女性主义哲学研究的新进展(2006—2011年) 作者：肖巍,朱晓佳 \n- [2] 参考文献：改革开放30年来的中国女性主义伦理学研究 作者：宋建丽 \n- [3] 参考文献：性差异的身体与伦理——伊丽格瑞女性主义研究 作者：游贤梅 \n- [4] 参考文献：男权主义的哲学批判 作者：郭献明 \n- [5] 参考文献：政治哲学视域中的性别正义 作者：宋建丽 \n- [6] 参考文献：在哲学与政治之间:女性主义理论的自我颠覆 作者：夏莹 \n- [7] 参考文献：近五年来女性主义认识论在中国的发展简述 作者：周冏 \n- [8] 参考文献：反思现代女性主义 作者：车铭洲 \n- [9] 参考文献：性别问题与性别意识——女性主义科学哲学的生长点 作者：董美珍 \n- [10] 参考文献：从维特根斯坦后期哲学思想看语言性别研究 作者：李玉坤 \n\n所有参考文献已阅读并学习完成！\n",
          //       task_stage: 2,
          //       task_theme: "算力资源分配",
          //       task_time: "2025-04-11 20:21:42",
          //     },
          //   ],
          // };
          onSuccess(res.result); // 返回结果
          // onSuccess(data); // 返回结果
        }
        // 继续轮询
      } else if (res.result.paper_stage == 3) {
        console.log("轮询失败，状态：", res);
        stop(); // 停止轮询
      } else {
        console.log("生成完成，结果：", res);

        // 调用回调，将结果返回给调用方
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(res.result); // 返回结果
        }

        stop(); // 停止轮询
      }
    },
    30000, // 轮询间隔
    5, // 最大重试次数
    5600000 // 超时时间
  );
}

/**
 * 启动唯一轮询
 * @param {Object} data 请求数据
 */
export function startUniquePaperPolling(data, onSuccess) {
  // 如果已存在轮询实例，先停止它
  if (activePollingInstance) {
    activePollingInstance.stop();
    activePollingInstance = null;
  }

  // 创建新的业务轮询实例，并传入回调
  activePollingInstance = createPaperPolling(data, onSuccess);

  // 启动轮询
  activePollingInstance.start();
}

/**
 * 手动停止轮询
 */
export function stopPaperPolling() {
  if (activePollingInstance) {
    activePollingInstance.stop();
    activePollingInstance = null;
  }
}
