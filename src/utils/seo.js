/**
 * SEO 工具函数
 * 用于动态更新页面的 meta 标签、Open Graph 标签等
 */

import defaultSettings from '@/settings'
import getPageTitle from './get-page-title'

const siteTitle = defaultSettings.title || '万象写作'
const siteUrl = 'https://mixpaper.cn'
const defaultDescription = '万象写作 - 专业的AI论文生成工具，支持一键生成论文、开题报告，提供AIGC降重、AI写作、论文查重等学术辅助服务，帮助您快速完成高质量学术论文。'
const defaultImage = `${siteUrl}/favicon.ico`

// 页面标题映射（中文优化）
const pageTitleMap = {
  'writePaper': 'AI论文生成 - 一键生成高质量学术论文',
  'reduceRepetition': '论文降重降AIGC率 - 原创度检测与智能改写',
  'chat': 'AI论文助手 - 智能问答与写作指导',
  'plagiarismCheck': '论文查重 - 专业查重检测服务',
  'searchPaper': '论文搜索 - 海量学术文献检索',
  'homePage': '万象写作 - AI论文生成工具首页',
  'preview': '论文范文预览 - 查看高质量论文样例'
}

/**
 * 更新或创建 meta 标签
 * @param {string} name - meta 标签的 name 或 property
 * @param {string} content - meta 标签的内容
 * @param {string} type - 'name' 或 'property'
 */
function updateMetaTag(name, content, type = 'name') {
  if (!content) return
  
  const selector = type === 'property' 
    ? `meta[property="${name}"]` 
    : `meta[name="${name}"]`
  
  let metaTag = document.querySelector(selector)
  
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute(type, name)
    document.head.appendChild(metaTag)
  }
  
  metaTag.setAttribute('content', content)
}

/**
 * 更新 canonical 标签
 * @param {string} path - 路由路径
 */
export function updateCanonicalTag(path) {
  const baseUrl = window.location.origin
  const cleanPath = path.split('?')[0] // 只移除查询参数，保留hash
  const canonicalUrl = baseUrl + (cleanPath.startsWith('/') ? '' : '/') + cleanPath
  
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.setAttribute('href', canonicalUrl)
}

/**
 * 更新页面 SEO 信息
 * @param {Object} route - Vue Router 路由对象
 */
export function updateSEO(route) {
  const { meta, fullPath } = route
  
  // 获取页面标题（优先使用中文优化标题）
  let pageTitle
  if (meta?.title && pageTitleMap[meta.title]) {
    pageTitle = pageTitleMap[meta.title] + ' - ' + siteTitle
  } else {
    pageTitle = getPageTitle(meta?.title)
  }
  document.title = pageTitle
  
  // 获取页面描述（优化为更详细的中文描述）
  let description = meta?.describe || meta?.description || defaultDescription
  // 如果描述太短，补充更详细的信息
  if (description.length < 50 && meta?.title) {
    const titleDescMap = {
      'writePaper': '使用AI技术一键生成高质量学术论文，支持自定义主题、结构和大纲，快速完成开题报告、毕业论文、学术论文等各类写作任务。',
      'reduceRepetition': '专业的论文降重和AIGC率降低服务，通过智能改写技术保证原创度，确保通过知网、维普、格子达等主流查重系统。',
      'chat': 'AI论文写作助手，提供智能问答、写作指导、思路梳理等功能，帮助您解决论文写作过程中的各种问题。',
      'plagiarismCheck': '专业的论文查重检测服务，支持多平台查重，提供详细的查重报告和修改建议，确保论文原创性。',
      'searchPaper': '海量学术文献检索平台，快速查找相关论文、期刊、会议论文等学术资源，支持多维度筛选和精准搜索。'
    }
    if (titleDescMap[meta.title]) {
      description = titleDescMap[meta.title]
    }
  }
  
  // 构建完整 URL
  const baseUrl = window.location.origin
  const cleanPath = fullPath.split('?')[0]
  const fullUrl = baseUrl + (cleanPath.startsWith('/') ? '' : '/') + cleanPath
  
  // 更新基础 meta 标签
  updateMetaTag('description', description, 'name')
  
  // 更新 Open Graph 标签
  updateMetaTag('og:title', pageTitle, 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:url', fullUrl, 'property')
  updateMetaTag('og:type', 'website', 'property')
  updateMetaTag('og:image', defaultImage, 'property')
  updateMetaTag('og:site_name', siteTitle, 'property')
  updateMetaTag('og:locale', 'zh_CN', 'property')
  
  // 更新 Twitter Card 标签
  updateMetaTag('twitter:card', 'summary', 'name')
  updateMetaTag('twitter:title', pageTitle, 'name')
  updateMetaTag('twitter:description', description, 'name')
  updateMetaTag('twitter:image', defaultImage, 'name')
  
  // 针对中文搜索引擎的优化标签
  // 百度优化：添加更多描述性标签
  updateMetaTag('author', siteTitle, 'name')
  updateMetaTag('copyright', siteTitle, 'name')
  
  // 更新 canonical 标签
  updateCanonicalTag(fullPath)
}

/**
 * 初始化结构化数据（JSON-LD）
 * 注意：此函数在应用初始化时调用，后续路由切换时会被 updateStructuredData 覆盖
 */
export function initStructuredData() {
  // 移除旧的 structured data（如果有）
  const oldScripts = document.querySelectorAll('script[type="application/ld+json"]')
  oldScripts.forEach(script => script.remove())
  
  // 创建基础的组织结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/#/main/explore?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
  
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

/**
 * 更新页面特定的结构化数据
 * @param {Object} route - Vue Router 路由对象
 */
export function updateStructuredData(route) {
  const { meta, fullPath } = route
  const baseUrl = window.location.origin
  const cleanPath = fullPath.split('?')[0]
  const fullUrl = baseUrl + (cleanPath.startsWith('/') ? '' : '/') + cleanPath
  
  // 移除旧的 structured data
  const oldScripts = document.querySelectorAll('script[type="application/ld+json"]')
  oldScripts.forEach(script => script.remove())
  
  // 使用与 updateSEO 相同的标题逻辑，确保一致性
  let pageTitle
  if (meta?.title && pageTitleMap[meta.title]) {
    pageTitle = pageTitleMap[meta.title] + ' - ' + siteTitle
  } else {
    pageTitle = getPageTitle(meta?.title)
  }
  
  // 使用与 updateSEO 相同的描述逻辑
  let description = meta?.describe || meta?.description || defaultDescription
  if (description.length < 50 && meta?.title) {
    const titleDescMap = {
      'writePaper': '使用AI技术一键生成高质量学术论文，支持自定义主题、结构和大纲，快速完成开题报告、毕业论文、学术论文等各类写作任务。',
      'reduceRepetition': '专业的论文降重和AIGC率降低服务，通过智能改写技术保证原创度，确保通过知网、维普、格子达等主流查重系统。',
      'chat': 'AI论文写作助手，提供智能问答、写作指导、思路梳理等功能，帮助您解决论文写作过程中的各种问题。',
      'plagiarismCheck': '专业的论文查重检测服务，支持多平台查重，提供详细的查重报告和修改建议，确保论文原创性。',
      'searchPaper': '海量学术文献检索平台，快速查找相关论文、期刊、会议论文等学术资源，支持多维度筛选和精准搜索。'
    }
    if (titleDescMap[meta.title]) {
      description = titleDescMap[meta.title]
    }
  }
  
  // 创建页面特定的结构化数据（WebPage）
  const webPageData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    url: fullUrl,
    description: description,
    inLanguage: 'zh-CN',
    isPartOf: {
      '@type': 'WebSite',
      name: siteTitle,
      url: siteUrl
    }
  }
  
  // 创建组织/服务结构化数据（针对百度优化）
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteTitle,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: 'zh-CN'
  }
  
  // 创建服务结构化数据（针对百度优化）
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI论文生成服务',
    name: pageTitle,
    provider: {
      '@type': 'Organization',
      name: siteTitle,
      url: siteUrl,
      logo: defaultImage
    },
    areaServed: {
      '@type': 'Country',
      name: 'CN'
    },
    description: description,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CNY'
    }
  }
  
  // 添加 BreadcrumbList 结构化数据（提升SEO）
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: fullUrl
      }
    ]
  }
  
  // 添加所有结构化数据
  const dataArray = [webPageData, organizationData, serviceData, breadcrumbData]
  
  dataArray.forEach(data => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)
  })
}

// 百度自动推送标记（确保只初始化一次）
let baiduPushInitialized = false

/**
 * 百度自动推送（通用版本，无需站长工具）
 * 这个版本使用百度的通用推送接口，不需要站长工具验证
 * 注意：此函数只需要调用一次，后续路由切换不需要重复调用
 * @param {string} url - 要推送的 URL（已废弃，保留用于兼容）
 */
export function pushToBaidu(url) {
  // 百度自动推送代码（通用版本）
  // 这个版本不需要站长工具验证，可以直接使用
  // 只在首次调用时初始化，避免重复加载脚本
  if (typeof window !== 'undefined' && 
      window.location.hostname === 'mixpaper.cn' && 
      !baiduPushInitialized) {
    
    // 检查是否已经存在推送脚本
    if (!document.querySelector('script[data-baidu-push]')) {
      const baiduPushScript = document.createElement('script')
      baiduPushScript.setAttribute('data-baidu-push', 'true')
      baiduPushScript.innerHTML = `
        (function(){
          var bp = document.createElement('script');
          var curProtocol = window.location.protocol.split(':')[0];
          if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
          } else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
          }
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(bp, s);
        })();
      `
      document.head.appendChild(baiduPushScript)
      baiduPushInitialized = true
    }
  }
}

