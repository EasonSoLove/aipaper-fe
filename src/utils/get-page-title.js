import defaultSettings from '@/settings'

const title = defaultSettings.title || '万象写作'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
