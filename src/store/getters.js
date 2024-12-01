const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  language: (state) => state.app.language,

  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  sub_domain: (state) => state.user.sub_domain,
  userInfo: (state) => state.user.userInfo,
  agent_image: (state) => state.user.agent_image,
  homeData: (state) => state.app.homeData,
  lineTitle: (state) => state.app.lineTitle,
  requestForm: (state) => state.app.requestForm,
  step3PdfUrl: (state) => state.app.step3PdfUrl,
  currentOrder: (state) => state.app.currentOrder,
  produceLineStatus: (state) => state.app.produceLineStatus,
  activeIndex: (state) => state.app.activeIndex,
  pollingStatus: (state) => state.paper.pollingStatus,
  additionalList: (state) => state.paper.additionalList,
  preViewId: (state) => state.paper.preViewId,
};
export default getters;
