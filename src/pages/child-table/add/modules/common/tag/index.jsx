import React, { Component } from 'react'
import { Form, Input, Select, message } from 'antd'
import { PropTypes } from 'prop-types'
import { ERR_OK } from '@Constants'
import { getCommonDimesions } from '@Redux/commonTagAndDimesion'
import { apiSelfTagTagList } from '@Api/self-tag-tag'
import { connect } from 'react-redux'

const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => state.commonTagAndDimesionsReducer,
  { getCommonDimesions }
)
class ChildTag extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      moduleType: 4,
      tags: []
    }
    this.dimensionChange = this.dimensionChange.bind(this)
    // 获取公用的维度数据
    this.props.getCommonDimesions()
  }

  dimensionChange(v) {
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    this.props.form.setFieldsValue({
      [`${moduleSymbol}~resourceId`]: undefined
    })
    if (!v) {
      this.setState({
        tags: []
      })
      return
    }
    this.getTags(v)
  }

  getTags = async (source) => {
    try {
      const options = {
        dimensionId: source,
        paged: false
      }
      const tagsRes = await apiSelfTagTagList(options)
      if (tagsRes.code !== ERR_OK) {
        message.error(tagsRes.msg)
        return
      }
      this.setState({
        tags: tagsRes.data.dataList
      })
    } catch (error) {
      console.log(error)
    }
  }
  // <FormItem
  //         {...formItemLayout}
  //         label={
  //           <label className="ant-form-item-required">维度:</label>
  //         }
  //         colon={false}
  //       >
  //         <Select
  //           placeholder="请选择维度"
  //           allowClear
  //           defaultValue={undefined}
  //           onChange={(v) => this.dimensionChange(v)}
  //           getPopupContainer={trigger => trigger.parentNode}
  //         >
  //           {
  //             this.props.commonDimesions.map((item) => (
  //               <Option key={item.id} value={item.id}>{item.dimensionName}</Option>
  //             ))
  //           }
  //         </Select>
  //       </FormItem>
  // <FormItem
  //         {...formItemLayout}
  //         label="自运营标签"
  //       >
  //         {getFieldDecorator(`${moduleSymbol}~resourceId`, {
  //           initialValue: undefined,
  //           rules: [
  //             {
  //               required: true, message: '请选择自运营标签',
  //             }
  //           ],
  //         })(
  //           <Select
  //             allowClear
  //             getPopupContainer={trigger => trigger.parentNode}
  //             placeholder="请选择自运营标签"
  //             notFoundContent="请先选择维度"
  //           >
  //             {
  //               this.state.tags.map((item) => (
  //                 <Option key={item.id} value={item.id}>{item.name}</Option>
  //               ))
  //             }
  //           </Select>
  //         )}
  //       </FormItem>

  render() {
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content
    } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6, offset: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    return (
      <div>
        <FormItem
          {...formItemLayout}
          label="展示形式"
        >
          {getFieldDecorator(`${moduleSymbol}~moduleType`, {
            initialValue: 4,
            rules: [
              {
                required: true, message: '请选择展示形式',
              }
            ],
          })(
            <Select
              onSelect={e => {
                this.setState({
                  moduleType: e
                })
              }}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={4}>平铺</Option>
              <Option value={5}>列表</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="平铺行数或展示数量"
        >
          {
            getFieldDecorator(`${moduleSymbol}~displayNum`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入平铺行数或展示数量',
                }
              ]
            })(
              <Input type="number" placeholder="请输入平铺行数或展示数量" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="模块展示名称"
        >
          {
            getFieldDecorator(`${moduleSymbol}~displayName`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入展示名称',
                },
                {
                  max: 10,
                  message: '展示名称应该小于10个字符',
                }
              ]
            })(
              <Input placeholder="请输入展示名称" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="自运营标签Id"
        >
          {
            getFieldDecorator(`${moduleSymbol}~resourceId`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入自运营标签Id',
                }
              ]
            })(
              <Input type="number" placeholder="请输入自运营标签Id" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="专辑来源"
        >
          {getFieldDecorator(`${moduleSymbol}~context-contentType`, {
            initialValue: 2,
            rules: [
              {
                required: true, message: '请选择专辑来源',
              }
            ],
          })(
            <Select
              allowClear
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={2}>主站专辑</Option>
              <Option value={8}>自运营专辑</Option>
            </Select>
          )}
        </FormItem>
      </div >
    )
  }
}

export default ChildTag

