import * as types from './mutation-types'

const mutations = {
  [types.SET_PAPERQUESINFO] (state, paperPartQuesInfo) {
    state.paperPartQuesInfo = paperPartQuesInfo
  }
}
export default mutations
