import * as types from './mutation-types'

export const modifyPaperQuesInfo = function ({
  commit
}, paperPartQuesInfo) {
  commit(types.SET_PAPERQUESINFO, paperPartQuesInfo)
}
