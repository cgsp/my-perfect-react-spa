import { appType, hardwareDeviceType, hardwareFirmwareType } from '../../constants'
import EnlargeImg from '../../components/EnlargeImg'
import React, { Component } from 'react'
import { Table } from "antd"
import { checkoutUrl } from '../../utils'
const columns = [
  {
    width: 200,
    dataIndex: 'title1',
    title: '修改部分'
  },
  {
    width: 200,
    dataIndex: 'title2',
    title: '修改字段'
  },
  {
    width: 200,
    dataIndex: 'title3',
    title: '原有信息'
  },
  {
    width: 200,
    dataIndex: 'title4',
    title: '修改后信息'
  },
]
export default class ModifyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageModifyInfo: []
    }


  }
  componentWillMount() {
    const { currentInfo, initInfo } = this.props
    this.pageInfo(currentInfo, initInfo)
  }

  infoIntegra = (info) => {
    const { mark } = this.props
    if (mark === 'modifyIntellApply-table') {
      const { hardwareSystemTypes } = info
      let hardwareSystem = ''
      hardwareSystemTypes && hardwareSystemTypes.split(';').map((item, index) => {
        hardwareSystem += hardwareFirmwareType[item] + '&'
      })
      hardwareSystem = hardwareSystem.substring(0, hardwareSystem.length - 1)
      return ([
        { label: '产品名称', value: info.appName, page: '基本信息' },
        { label: '设备类型', value: hardwareDeviceType[info.hardwareType], page: '基本信息' },
        { label: '产品简介', value: info.appDesc, page: '基本信息' },
        { label: '产品图标', value: info.appIcon, page: '基本信息' },
        { label: '固件系统', value: hardwareSystem, page: '基本信息' },
        { label: '首批订单量', value: info.primaryOrderCount, page: '合作规范' },
        { label: '预计上线时间', value: info.estimatedOnlineDate, page: '合作规范' },
        { label: '预估年产量', value: info.estimatedAnnualProduction, page: '合作规范' },
        { label: '应用截图', value: info.screenshotUrls, page: '合作规范' },
      ])
    } if (mark === 'modifyWebApply-table') {
      return ([
        { label: '应用名称', value: info.appName, page: '基本信息' },
        { label: '应用类型', value: appType[info.appType], page: '基本信息' },
        { label: '应用简介', value: info.appDesc, page: '基本信息' },
        { label: '应用图标', value: info.appIcon, page: '基本信息' },
        { label: '网站地址', value: info.webAddress, page: '基本信息' },
        { label: '应用截图', value: info.screenshotUrls, page: '合作规范' },
      ])
    } else {
      return ([
        { label: '应用名称', value: info.appName, page: '基本信息' },
        { label: '应用类型', value: appType[info.appType], page: '基本信息' },
        { label: '应用简介', value: info.appDesc, page: '基本信息' },
        { label: '应用图标', value: info.appIcon, page: '基本信息' },
        { label: 'Android APK包', value: info.androidPackageUrl, page: '合作规范' },
        { label: 'ios IPA包', value: info.iosPackageUrl, page: '合作规范' },
        { label: '应用截图', value: info.screenshotUrls, page: '合作规范' },
      ])
    }

  }

  pageInfo = (currentInfo, basicAppInfo) => {
    const initInfos = this.infoIntegra(basicAppInfo)
    const currentInfos = this.infoIntegra(currentInfo)

    const newArr = []
    currentInfos.map((item, index) => {
      initInfos.map((item2, num) => {
        if (item.label === item2.label) {
          if (item.value && (item.value !== item2.value)) {
            if (item.label === '应用图标' || item.label === '应用截图' || item.label === '产品图标') {
              item.value = <EnlargeImg picList={item.value} />
              item2.value = <EnlargeImg picList={item2.value} />
            }
            if (item.label === '首批订单量') {
              item.value = item.value + ' 台'
              item2.value = item2.value + ' 台'
            }
            if (item.label === '网站地址') {
              item.value = <a href={checkoutUrl(item.value)} target="_blank">{item.value}</a>
              item2.value = <a href={checkoutUrl(item2.value)} target="_blank">{item2.value}</a>
            }
            if (item.label === 'Android APK包') {
              item.value = <a href={item.value}>{item.value}</a>
              item2.value = <a href={item2.value}>{item2.value}</a>
            }
            if (item.label === 'ios IPA包') {
              item.value = <a href={item.value}>{item.value}</a>
              item2.value = <a href={item2.value}>{item2.value}</a>
            }

            newArr.push({
              key: num,
              title1: item.page,
              title2: item.label,
              title3: item2.value,
              title4: item.value,
            })
          }

        }
      })
    })
    this.setState({ pageModifyInfo: newArr })
  }

  render() {
    const { pageModifyInfo } = this.state
    const { mark } = this.props
    if (!(pageModifyInfo && pageModifyInfo.length > 0)) {
      return null
    }
    return (
      <div className={mark}>
        <Table columns={columns}
          dataSource={pageModifyInfo}
          bordered={true}
          pagination={false}
        />
      </div>
    )
  }
}



