import React, { Component } from 'react'
import { Modal, Form, Radio } from 'antd'
import { PropTypes } from 'prop-types'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class AddOrEdit extends Component {
  static propTypes = {
    addOrEditTitle: PropTypes.string,
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { rewardTypes } = this.props.addOrEditInitValues || []
    let rulesList = []
    rewardTypes.forEach(element => {
      rulesList.push(element.key)
    })
    this.state = {
      rulesList
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      // rule1 :REWARD_ACQUISITION 1开启，2关闭
      // rule2 :REWARD_RENEWAL 1开启，2关闭
      let rewardTypes = []
      if (values.rule1 === 1) {
        rewardTypes.push('REWARD_ACQUISITION')
      }
      delete values.rule1
      if (values.rule2 === 1) {
        rewardTypes.push('REWARD_RENEWAL')
      }
      delete values.rule2
      values.rewardTypes = rewardTypes
      this.props.addOrEditOk(values)
      // console.log(values)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const { rulesList } = this.state
    return (
      <Modal
        title={this.props.addOrEditTitle}
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem
            {...formItemLayout}
            label="拉新奖励"
          >
            {getFieldDecorator('rule1', {
              initialValue: rulesList.indexOf('REWARD_ACQUISITION') > -1 ? 1 : 2,
              rules: [
                {
                  required: true, message: '请选择',
                }
              ],
            })(
              <RadioGroup className="list-model-div">
                <Radio value={1}>开启</Radio>
                <Radio value={2}>关闭</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="续订奖励"
          >
            {getFieldDecorator('rule2', {
              initialValue: rulesList.indexOf('REWARD_RENEWAL') > -1 ? 1 : 2,
              rules: [
                {
                  required: true, message: '请选择',
                }
              ],
            })(
              <RadioGroup className="list-model-div">
                <Radio value={1}>开启</Radio>
                <Radio value={2}>关闭</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal >
    )
  }
}

const WrapperAddOrEdit = Form.create()(AddOrEdit)
export default WrapperAddOrEdit
