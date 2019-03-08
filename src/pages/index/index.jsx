/* eslint-disable */
import React, { Component } from 'react'
import MiniRefreshTools from 'minirefresh'
import style from './style.scss'
import { apiRefreshListData } from '@Api/apiRefreshListData'
import { SUCCESS_OK } from '@Constants'
import { Toast } from 'antd-mobile'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: []
    }
    this.page = 0
  }
  componentDidMount() {
    const that = this
    this.miniRefresh = new MiniRefresh({
      container: '#minirefresh',
      down: {
        callback: function () {
          console.log('下拉')
          that.getListData('down')
        }
      },
      up: {
        callback: function () {
          // 上拉事件
          // 注意，由于默认情况是开启满屏自动加载的，所以请求失败时，请务必endUpLoading(true)，防止无限请求
          console.log('上拉')
          that.getListData('up')
        }
      }
    })
    console.log(this.miniRefresh)
  }

  async getListData(downOrUp) {
    try {
      if (downOrUp === 'down') {
        // 下拉刷新页码设置
        this.page = 1
      } else {
        // 上拉加载递增页码
        this.page++
      }
      const res = await apiRefreshListData(this.page)
      if (res.code !== SUCCESS_OK) {
        Toast.fail('服务出错,请稍后重试', 1, null, false)
        return
      }

      if (downOrUp === 'down') {
        // 如果是下拉刷新的话
        this.setState({
          listData: res.data
        })
        // 结束下拉刷新
        this.miniRefresh.endDownLoading(true)
      }

      if (downOrUp === 'up') {
        // 如果是上拉加载的话
        this.setState({}, () => {
          let oldData = this.state.listData.slice()
          let nowData = oldData.concat(res.data)
          this.setState({
            listData: nowData.slice()
          })
          if (res.last_page === this.page) {
            // 证明已经到底了
            // 结束上拉加载
            this.miniRefresh.endUpLoading(true)
          } else {
            // 证明没到底
            // 不结束上拉加载
            this.miniRefresh.endUpLoading(false)
          }
        })

      }

    } catch (error) {
      console.log('服务端报错')
      Toast.fail('服务出错,请稍后重试', 1, null, false)
      if (downOrUp === 'down') {
        this.miniRefresh.endDownLoading(true)
      } else {
        this.miniRefresh.endUpLoading(true)
      }
    }
  }

  render() {
    const { listData } = this.state
    return (
      <div className={style.index}>
        <div className={style.header}>
          我是头部
        </div>
        <div className={style.content}>
          <div id="minirefresh" className={`${style['minirefresh-wrap']} minirefresh-wrap`}>
            <div className={`${style['minirefresh-scroll']} minirefresh-scroll`}>
              <ul className={style['data-list']} id="listdata">
                {
                  listData.map((item) => {
                    <li className={style['list-item']} key={item.id}>
                      <a href="javascript:;" className={style['news-link']}>
                        <span className={style['news-title']}>
                          {item.title}
                        </span>
                        <span className={style['news-date']}>
                          {new Date().toLocaleString()}
                        </span>
                      </a>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/* eslint-enable */
