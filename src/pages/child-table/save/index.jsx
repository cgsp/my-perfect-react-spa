import React, { Component } from 'react'
import { Modal, Form, Input, message, Select } from 'antd'
import { ERR_OK } from '@Constants'
import { PropTypes } from 'prop-types'
import { apiChildParter } from '@Api/child-table'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input


class ChildTablesave extends Component {
  static propTypes = {
    saveTitle: PropTypes.string,
    saveVisible: PropTypes.bool,
    saveInitValues: PropTypes.object,
    saveOk: PropTypes.func,
    saveCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { appKey, parterSelectData } = this.props.saveInitValues
    this.state = {
      parterSelectData,
      appKey
    }
    // 模糊匹配
    this.handleParterSelectChange = this.handleParterSelectChange.bind(this)
    this.handleParterSelectSearch = this.handleParterSelectSearch.bind(this)
    this.timeout = null
    this.currentAccount = ''
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.setState({
      }, () => {
        values = { ...values, ...{ appKey: this.state.appKey } }
        if (!values.appKey) {
          message.error('请选择合作方')
          return
        }
        console.log(values)
        this.props.saveOk(values)
      })
    })
  }

  // 合作方的模糊匹配
  handleParterSelectSearch(value) {
    // console.log(value)
    this.getSelectUserList(value, data => this.setState({ parterSelectData: data }))
  }

  // 合作方的模糊匹配
  getSelectUserList(value, callback) {
    if (!value) {
      return
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.currentAccount = value

    const options = {
      appName: value
    }
    this.timeout = setTimeout(() => {
      apiChildParter(options)
        .then(res => {
          if (this.currentAccount === value) {
            if (res.code !== ERR_OK) {
              message.error(res.msg)
              return
            }
            // 只取前面的20条
            let result = res.data.slice(0, 20)
            const arr = []
            result.forEach(item => {
              arr.push({
                value: item.appKey,
                text: item.appName
              })
            })
            console.log(res)
            callback(arr)
          }
        })
    }, 300)

  }

  // 合作方的模糊匹配
  handleParterSelectChange(value) {
    this.setState({
      appKey: value,
    }, () => {
      console.log(this.state.appKey)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    return (
      <Modal
        title={this.props.saveTitle}
        visible={this.props.saveVisible}
        onCancel={this.props.saveCancel}
        onOk={(e) => this.handleSubmit(e)}
        width={800}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll', paddingRight: 40 }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="合作方"
            >
              <Select
                showSearch
                placeholder="请输入合作方"
                defaultValue={1}
                allowClear={true}
                value={this.state.appKey}
                onSearch={this.handleParterSelectSearch}
                onChange={this.handleParterSelectChange}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={'根据此关键字，无法搜索'}
                getPopupContainer={trigger => trigger.parentNode}
              >
                {
                  this.state.parterSelectData.map(item => (
                    <Option key={item.value}>{item.text}</Option>
                  ))
                }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="子站名称"
            >
              {getFieldDecorator('siteName', {
                initialValue: this.props.saveInitValues.siteName,
                rules: [
                  {
                    required: true, message: '请输入子站名称',
                  },
                  {
                    max: 20, message: '名称须小于20个字符',
                  }
                ],
              })(
                <Input placeholder="请输入子站名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="子站简介"
            >
              {getFieldDecorator('description', {
                initialValue: this.props.saveInitValues.description,
                rules: [
                  {
                    max: 200,
                    message: '子站简介应该小于200个字符',
                  },
                  {
                    required: true,
                    message: '请输入子站简介',
                  }
                ]
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} placeholder="请输入子站简介" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperChildTablesave = Form.create()(ChildTablesave)
export default WrapperChildTablesave
