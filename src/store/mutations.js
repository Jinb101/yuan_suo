import Stores from './_let'
export default {
  [Stores.add](state, num) {
    state.count += num * 1;
  },
  [Stores.fixed](state, n) {
    state.fixed = n
  },
  [Stores.share](state, n) {
    state.share = n
  },
  [Stores.progress](state, n) {
    state.progress = n
  },
  [Stores.comment](state, n) {
    state.comment = n
  },
  [Stores.tabbarStatus](state, n) {
    state.tabbarStatus = n
  },
  [Stores.title](state, n) {
    state.title = n
  },
  [Stores.h5](state, n) {
    state.h5 = n
  }
}
