import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import { PropTypes } from 'prop-types'
// import { commonSmallTypes } from '@Api'

const FormItem = Form.Item
const Option = Select.Option

class ChildCategory extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      moduleType: 4,
      smallTypes: []
    }
    // this.sourceChange = this.sourceChange.bind(this)
  }
  //   <FormItem
  //   {...formItemLayout}
  //   label={
  //     <label className="ant-form-item-required">分类来源:</label>
  //   }
  //   colon={false}
  // >
  //   <Select
  //     onChange={(v) => this.sourceChange(v)}
  //     defaultValue={1}
  //     getPopupContainer={trigger => trigger.parentNode}
  //   >
  //     <Option value={1}>主站分类</Option>
  //     <Option value={2}>自运营分类</Option>
  //   </Select>
  // </FormItem>
  // <FormItem
  //         {...formItemLayout}
  //         label="分类"
  //       >
  //         {getFieldDecorator(`${moduleSymbol}~resourceId`, {
  //           initialValue: undefined,
  //           rules: [
  //             {
  //               required: true, message: '请选择分类',
  //             }
  //           ],
  //         })(
  //           <Select
  //             allowClear
  //             getPopupContainer={trigger => trigger.parentNode}
  //           >
  //             {
  //               this.state.smallTypes.map((item) => (
  //                 <Option key={item.id} value={item.id}>{item.name}</Option>
  //               ))
  //             }
  //           </Select>
  //         )}
  //       </FormItem>

  // componentDidMount() {
  //   this.getSmallTypes('1')
  // }
  // sourceChange(v) {
  //   const { taskId, content
  //   } = this.props.task
  //   const moduleSymbol = `${taskId}~${content}`
  //   this.getSmallTypes(v)
  //   this.props.form.setFieldsValue({
  //     [`${moduleSymbol}~resourceId`]: undefined
  //   })
  // }

  // getSmallTypes = async (source) => {
  //   try {
  //     if (!source) {
  //       this.setState({
  //         smallTypes: []
  //       })
  //     }
  //     const smallTypeRes = await commonSmallTypes(source)
  //     if (smallTypeRes.code !== ERR_OK) {
  //       message.error(smallTypeRes.msg)
  //       return
  //     }
  //     this.setState({
  //       smallTypes: smallTypeRes.data
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
          label="分类ID"
        >
          {
            getFieldDecorator(`${moduleSymbol}~resourceId`, {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: '请输入分类Id',
                }
              ]
            })(
              <Input type="number" placeholder="请输入分类Id" onPressEnter={e => e.preventDefault()} />
            )
          }
        </FormItem>
        {
          this.state.moduleType !== 7
            ?
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
            </FormItem> : null
        }
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
      </div >
    )
  }
}

export default ChildCategory

