var store = new Vuex.Store({
  state: {
    feed: [],
    output: [],
    pages: [],
    showModal: false,
    modalData: {},
    selectedPage: "Reuters",
    selectedCat: "International_News",
    columns: 5,
    pageInfo: {},
    categories: [],
    catFeed: [],
    catOutput: [],
    sortBy: ["created_time", "likes", "comments", "shares"],
    selectedSortBy: "created_time"
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setFeed(state, input){
        state.feed = input;
    },
    setOutput(state, input){
        state.output = input;
    },
    setCatFeed(state, input){
        state.catFeed = input;
    },
    setCatOutput(state, input){
        state.catOutput = input;
    },
    setPages(state, input){
        state.pages = input;
    },
    setModalData(state, input){
        state.modalData = input;
    },
    updateSelectedPage(state, input){
        state.selectedPage = input;
    },
    updateSelectedCat(state, input){
        state.selectedCat = input;
    },
    updateColumns(state, input){
        state.columns = input;
    },
    setPageInfo(state, input){
        state.pageInfo = input;
    },
    setCats(state, input){
        state.categories = input;
    },
    updateSelectedSortBy(state, input){
        state.selectedSortBy = input;
    }
  }
})
