import { observable, action } from 'mobx'

class Store {
  @observable loading = false
  @observable downPercentLoading = false
  @observable downPercentLoadingPercent = 0

  @action
  changeLoading(state) {
    this.loading = state
  }

  @action
  changeDownPercentLoading(state, percent) {
    this.downPercentLoading = state
    this.downPercentLoadingPercent = percent
  }
}

export default new Store()
