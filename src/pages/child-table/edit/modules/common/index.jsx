import React, { Component } from 'react'
import { Form, Select } from 'antd'
import { PropTypes } from 'prop-types'
import DeleteIcon from '../imgs/delete.png'
import MoveIcon from '../imgs/move.png'
import './style.scss'
import ChildSingleListen from './single-listen'
import ChildMoreListen from './more-listen'
import ChildCategory from './category'
import ChildTag from './tag'
import ChildMainList from './main-list'
import ChildAlbum from './album'
import ChildSingleVoice from './single-voice'


const FormItem = Form.Item
const Option = Select.Option

class ModuleCommon extends Component {
  static propTypes = {
    deleteModule: PropTypes.func
  }

  constructor(props) {
    super(props)
    // console.log(props)
    // console.log(this.props.task.moduleValue)
    this.state = {
      resourceType: this.props.task.moduleValue.resourceType ? this.props.task.moduleValue.resourceType : undefined,
      moduleValue: props.task.moduleValue || {}
    }
    this.changeChildModule = this.changeChildModule.bind(this)
  }

  changeChildModule(v) {
    // console.log(typeof v)
    // console.log(v)
    this.setState({
      resourceType: v
    })
    const { taskId, content } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    this.props.form.setFieldsValue({
      [`${moduleSymbol}~moduleType`]: undefined,
      [`${moduleSymbol}~displayNum`]: undefined,
      [`${moduleSymbol}~resourceId`]: undefined,
      [`${moduleSymbol}~topContentIds`]: undefined,
      [`${moduleSymbol}~displayName`]: undefined,
      [`${moduleSymbol}~context-contentType`]: undefined,
    })
  }

  render() {
    const getFieldDecorator = this.props.getFieldDecorator
    const { taskId, content } = this.props.task
    const moduleSymbol = `${taskId}~${content}`
    // console.log(moduleSymbol)
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

    let Child
    switch (this.state.resourceType) {
      case 3:
        Child = ChildSingleListen
        break
      case 9:
        Child = ChildMoreListen
        break
      case 6:
        Child = ChildCategory
        break
      case 7:
        Child = ChildTag
        break
      case 4:
        Child = ChildMainList
        break
      case 2:
        Child = ChildAlbum
        break
      case 1:
        Child = ChildSingleVoice
        break
      default:
        break
    }

    return (
      <div className="common-module">
        <div className="module-title">
          <span className="text">普通模块</span>
          <img className="delete" src={DeleteIcon} alt="delete" onClick={this.props.deleteModule} />
          <img className="move" src={MoveIcon} alt="move" />
        </div>
        <div className="module-content">
          <FormItem
            {...formItemLayout}
            label={<label className="ant-form-item-required">内容类型:</label>}
            colon={false}
          >
            {getFieldDecorator(`${moduleSymbol}~resourceType`, {
              initialValue: this.state.resourceType
            })(
              <Select
                onSelect={this.changeChildModule}
                getPopupContainer={trigger => trigger.parentNode}
              >
                <Option value={3}>听单</Option>
                <Option value={9}>多个听单</Option>
                <Option value={6}>分类</Option>
                <Option value={7}>自运营标签</Option>
                <Option value={4}>主站榜单</Option>
                <Option value={2}>专辑</Option>
                <Option value={1}>声音</Option>
              </Select>
            )}
          </FormItem>
          <Child
            getFieldDecorator={getFieldDecorator}
            task={this.props.task}
            form={this.props.form}
            moduleValue={this.state.moduleValue}
          />
        </div>
      </div>
    )
  }
}

export default ModuleCommon

