import React, { Component } from 'react'
import './style.scss'
// import { Link } from 'react-router-dom'
import { sessionCache } from '@Utils/cache'
import BreadcrumbNav from '../../../../../components/bread-crumb'
import Reject from '@Components/rejectForm'
import {
  Form,
  Table,
  Steps,
  Button,
  Modal
} from 'antd'
import EnlargeImg from '../../../../../components/EnlargeImg'
const { Item } = Form
// const RadioGroup = Radio.Group
const Step = Steps.Step
// const { TextArea } = Input
const shortItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
}


const steps = [{
  title: '汇款申请',
  content: 'First-content',
}, {
  title: '商务审批',
  content: 'Second-content',
}, {
  title: '财务审批',
  content: 'Last-content',
}, {
  title: '完成',
  content: 'Last-content',
},]

const columns = [{
  title: '审批时间',
  dataIndex: 'time',
}, {
  title: '审批节点',
  dataIndex: 'money',
}, {
  title: '审批人',
  dataIndex: 'address',
}, {
  title: '审批结果',
  dataIndex: 'result',
}, {
  title: '备注',
  dataIndex: 'text',
},]

const data = [{
  key: '1',
  time: '2018-09-05 18:00:00',
  name: 'John Brown',
  money: '商务',
  address: '豆豆',
  result: "通过",
  text: '商务通过才有这条记录 通过意见需要回执单'
}];
@Form.create({})
export default class Audit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      value: '',
      isViewModel: false,
      rejectButton: false,
      passModal: false
    }
    this.basicAppInfo = sessionCache.get('highLinesWebsiteData') || {}
  }

  handleCancel = () => {
    this.setState({ isViewModel: false })
  }

  handleModalSubmit = () => {
    console.log('去掉审批驳回意见接口')
    this.setState({ isViewModel: false })
  }

  passCancel = () => {
    this.setState({ passModal: false })
  }
  passModalSubmit = () => {
    console.log('去掉审批通过意见接口')
    this.setState({ passModal: false })
  }

  render() {
    const { basicAppInfo } = this
    // const { isViewModel } = this.state

    const applyContent = [
      { label: '申请时间', value: <EnlargeImg picList={basicAppInfo.screenshotUrls} /> },
      { label: '开发者名称', value: '' },
      { label: '汇款金额', value: '' },
      { label: '汇款流水号', value: '' },
      { label: '汇款银行卡信息', value: '' },
      { label: '汇款凭证', value: '' },
      { label: '我方收款银行卡信息', value: '' },
      { label: '审批编号', value: '' },
      { label: '所属渠道', value: '' },
    ]

    const navData = {
      url: "/!F1-audit/!S2-fee/!T3-recharge",
      name1: "现金账户资金审批列表",
      name2: "线下汇款审批"
    }

    return (
      <div className="RechargeDetail-check-container-audit">
        <BreadcrumbNav {...navData} />
        <Steps current={this.state.current} className="progress">
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="RechargeDetail-title">线下汇款审批</div>

        <div className="RechargeDetail-basic-info">
          <div className="apply-content">
            <div className="title1">申请内容</div>
            <Form>
              {applyContent && applyContent.map((item, index) => {
                return (
                  <Item {...shortItemLayout} label={item.label} key={index} style={{ marginBottom: 0 }}>
                    {item.value}
                  </Item>
                )
              })}
            </Form>
          </div>
          <div className="apply-content">
            <div className="title1">审批记录</div>
            <Table
              className="recharge-table"
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </div>



        <div className="recharge-button">
          <Button type="primary" onClick={() => {
            this.setState({
              passModal: true,
            })
          }}>
            通过
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            onClick={() => {
              this.setState({
                isViewModel: true,
              })
            }}
          >
            驳回
          </Button>
        </div>
        <Modal
          className="help-top-remove-confirm"
          title={'审批驳回意见'}
          visible={this.state.isViewModel}
          okType="danger"
          onOk={this.handleModalSubmit}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel} >取消</Button>,
            <Button key="submit" type="primary" onClick={this.handleModalSubmit} disabled={this.state.rejectButton}>
              确定
            </Button>,
          ]}
        >
          <Reject
            wrappedComponentRef={ref => (this.rejectForm = ref)}
            label="审批驳回意见"
            msg="请填写审批驳回意见"
          />
        </Modal>

        <Modal
          className="help-top-remove-confirm"
          title={'审批通过意见'}
          visible={this.state.passModal}
          okType="danger"
          onOk={this.passModalSubmit}
          onCancel={this.passCancel}
          footer={[
            <Button key="back" onClick={this.passCancel} >取消</Button>,
            <Button key="submit" type="primary" onClick={this.passModalSubmit} disabled={this.state.rejectButton}>
              确定
            </Button>,
          ]}
        >
          <Reject
            wrappedComponentRef={ref => (this.passForm = ref)}
            label="审批通过意见"
            msg="请填写审批通过意见"
            label2="收款回执"
            msg2="请上传收款回执"
          />
        </Modal>x


      </div>
    )
  }
}
