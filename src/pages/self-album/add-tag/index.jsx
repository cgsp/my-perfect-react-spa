import React, { Component } from 'react'
import { Modal, Form, Input, Radio, Tag, Checkbox } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { CheckableTag } = Tag


@connect(
  state => state.commonTagAndDimesionsReducer,
  {}
)
class SelfAddTag extends Component {
  static propTypes = {
    addTagVisible: PropTypes.bool,
    addTagOk: PropTypes.func,
    addTagCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const nowAllTags = this.props.commonDimesionsAndTags[0].tags
    const activeChoiceType = this.props.commonDimesionsAndTags[0].choiceType
    this.state = {
      active: 0,
      nowAllTags: nowAllTags ? nowAllTags : [],
      activeChoiceType
    }
    // choiceType 1代表单选，2代表多选
    console.log(this.props.commonDimesionsAndTags[0].tags)
    console.log(this.props.commonDimesionsAndTags[0].choiceType)
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  changeDimension(item, index) {
    console.log(item, index)
    this.setState({
      active: index,
      nowAllTags: item.tags ? item.tags : [],
      activeChoiceType: item.choiceType
    })
  }

  render() {
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
        title={'新增维度'}
        visible={this.props.addTagVisible}
        onCancel={this.props.addTagCancel}
        onOk={(e) => this.handleSubmit(e)}
        width={800}
        destroyOnClose={true}
        zIndex={1000}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="维度名称"
            >
              <div className="tag-set">
                {
                  this.props.commonDimesionsAndTags.map((item, index) => {
                    return (
                      <CheckableTag
                        key={item.id}
                        color="#f50"
                        checked={this.state.active === index}
                        onChange={() => this.changeDimension(item, index)}
                      >{item.dimensionName}</CheckableTag>
                    )
                  })
                }
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标签名称"
            >
              <div>
                {
                  this.state.activeChoiceType === 1 ?
                    <RadioGroup>
                      {this.state.nowAllTags.map((item, index) => {
                        return (
                          <Radio key={item.id} value={item.id}>{item.name}</Radio>
                        )
                      })}
                    </RadioGroup>
                    :
                    <Checkbox.Group>
                      {this.state.nowAllTags.map((item, index) => {
                        return (
                          <Checkbox key={item.id} value={item.id}>{item.name}</Checkbox>
                        )
                      })}
                    </Checkbox.Group>
                }
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal >
    )
  }
}

const WrapperSelfAddTag = Form.create()(SelfAddTag)
export default WrapperSelfAddTag
