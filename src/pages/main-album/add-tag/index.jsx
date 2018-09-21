import React, { Component } from 'react'
import { Modal, Form, Radio, Tag, Checkbox } from 'antd'
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
    nowChoosedTagsIds: PropTypes.array
  }

  constructor(props) {
    console.log('重新渲染了')
    super(props)
    const nowChoosedTagsIds = this.props.nowChoosedTagsIds || []
    console.log(this.props.nowChoosedTagsIds)
    // const nowChoosedTagsIds = [41, 42, 48, 51, 66]
    // 根据当前被选中的所有标签ID，获取，这些被选中的标签的名称，组成一个数组
    const nowChoosedTags = this.transTagIDsToName(nowChoosedTagsIds)

    let firstDimension = this.props.commonDimesionsAndTags[0]
    firstDimension = firstDimension ? firstDimension : {
      id: 0,
      tags: [],
      choiceType: 2
    }
    // 当前的维度Id
    const nowChoosedDimensionId = firstDimension.id
    // 当前维度的类型
    const activeChoiceType = firstDimension.choiceType
    // 当前维度下的所有的标签
    const nowAllTags = firstDimension.tags




    // 根据当前被选中的所有标签ID，获取，获取当前，维度下，被选中的标签ID
    const nowChoosedTagsIdInNowDimension = this.getTagIdInNowDimen(nowChoosedDimensionId, nowChoosedTagsIds, activeChoiceType)

    // console.log(nowChoosedTagsIds)
    // console.log(nowChoosedTags)
    // console.log(nowChoosedDimensionId)
    // console.log(activeChoiceType)
    // console.log(nowAllTags)

    this.state = {
      active: 0,
      nowAllTags: nowAllTags ? nowAllTags : [],
      activeChoiceType,
      nowChoosedDimensionId,
      nowChoosedTagsIds,
      nowChoosedTags,
      nowChoosedTagsIdInNowDimension,
    }
    // choiceType 1代表单选，2代表多选
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({

    }, () => {
      this.props.addTagOk(this.state.nowChoosedTagsIds)
    })
  }

  // 处理当前维度下面，哪些id被获取了,传入维度的ID，获取，当前维度下，哪些标签被选中了
  transTagIDsToName = (nowChoosedTagsIds) => {
    const data = this.props.commonDimesionsAndTags
    let nowChoosedTags = []
    data.forEach(item => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
          if (nowChoosedTagsIds.indexOf(tag.id) > -1) {
            nowChoosedTags.push({
              id: tag.id,
              name: tag.name
            })
          }
        })
      }
    })
    return nowChoosedTags
  }

  // 根据当前被选中的所有标签ID，获取，获取当前，维度下，被选中的标签ID
  getTagIdInNowDimen = (nowChoosedDimensionId, nowChoosedTagsIds, activeChoiceType) => {
    let nowChoosedTagsIdInNowDimension
    const data = this.props.commonDimesionsAndTags
    let NowDimensionTags = data.find(item => {
      return item.id === nowChoosedDimensionId
    }).tags

    NowDimensionTags = (NowDimensionTags && NowDimensionTags.length) > 0 ? NowDimensionTags.slice() : null

    if (activeChoiceType === 1) {
      if (!NowDimensionTags) {
        nowChoosedTagsIdInNowDimension = []
      } else {
        nowChoosedTagsIdInNowDimension = []
        NowDimensionTags.forEach(item => {
          if (nowChoosedTagsIds.indexOf(item.id) > -1) {
            nowChoosedTagsIdInNowDimension.push(item.id)
          }
        })
      }
    } else {
      if (!NowDimensionTags) {
        nowChoosedTagsIdInNowDimension = []
      } else {
        nowChoosedTagsIdInNowDimension = []
        NowDimensionTags.forEach(item => {
          if (nowChoosedTagsIds.indexOf(item.id) > -1) {
            nowChoosedTagsIdInNowDimension.push(item.id)
          }
        })
      }
    }
    console.log(nowChoosedTagsIdInNowDimension)
    return nowChoosedTagsIdInNowDimension

  }

  changeDimension(item, index) {
    // console.log(item, index)
    this.setState({
      active: index,
      nowAllTags: item.tags ? item.tags : [],
      activeChoiceType: item.choiceType,
      nowChoosedDimensionId: item.id
    }, () => {
      const { nowChoosedDimensionId, nowChoosedTagsIds, activeChoiceType } = this.state
      const nowChoosedTagsIdInNowDimension = this.getTagIdInNowDimen(nowChoosedDimensionId, nowChoosedTagsIds, activeChoiceType)
      this.setState({
        nowChoosedTagsIdInNowDimension
      }, () => {
        console.log(this.state.nowChoosedTagsIdInNowDimension)
      })
    })
  }

  // 点击标签勾选的时候
  handleChoseTag = (e) => {
    const value = e.target.value - 0
    this.setState({
    }, () => {
      // 判断一下，如果。这个value,在当前的nowChoosedTagsIdInNowDimension里面，那么删除
      // 不在的话，添加
      let { activeChoiceType, nowChoosedTagsIdInNowDimension, nowChoosedTagsIds, nowAllTags } = this.state
      if (activeChoiceType === 1) {
        let hasInOld = false
        if (nowChoosedTagsIds.indexOf(value) > -1) {
          hasInOld = true
        }

        if (nowAllTags.length === 1) {
          if (hasInOld) {
            // 如果有我，删除我自己
            nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(value), 1)
            nowChoosedTagsIdInNowDimension.splice(nowChoosedTagsIdInNowDimension.indexOf(value), 1)
          } else {
            // 如果没我，添加我自己
            nowChoosedTagsIds.push(value)
            nowChoosedTagsIdInNowDimension.push(value)
          }
        } else {
          // 删除其他的小伙伴
          nowAllTags.forEach((item) => {
            if (item.id !== value && nowChoosedTagsIds.indexOf(item.id) > -1) {
              nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(item.id), 1)
            }
            if (item.id !== value && nowChoosedTagsIdInNowDimension.indexOf(item.id) > -1) {
              nowChoosedTagsIdInNowDimension.splice(nowChoosedTagsIdInNowDimension.indexOf(item.id), 1)
            }
          })

          if (hasInOld) {
            // 如果有我，删除我自己
            nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(value), 1)
            nowChoosedTagsIdInNowDimension.splice(nowChoosedTagsIdInNowDimension.indexOf(value), 1)
          } else {
            // 如果没我，添加我自己
            nowChoosedTagsIds.push(value)
            nowChoosedTagsIdInNowDimension.push(value)
          }
        }
      } else {
        if (nowChoosedTagsIdInNowDimension.indexOf(value) > -1) {
          nowChoosedTagsIdInNowDimension.splice(nowChoosedTagsIdInNowDimension.indexOf(value), 1)
          nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(value), 1)
        } else {
          nowChoosedTagsIdInNowDimension.push(value)
          nowChoosedTagsIds.push(value)
        }
      }
      const nowChoosedTags = this.transTagIDsToName(nowChoosedTagsIds)
      this.setState({
        nowChoosedTags,
        nowChoosedTagsIds,
        nowChoosedTagsIdInNowDimension
      })
    })

  }

  // 点击已选标签的删除操作
  deleteTag = (tagId) => {
    this.setState({
    }, () => {
      let { nowChoosedTagsIdInNowDimension, nowChoosedTagsIds } = this.state
      if (nowChoosedTagsIdInNowDimension.indexOf(tagId) > -1) {
        nowChoosedTagsIdInNowDimension.splice(nowChoosedTagsIdInNowDimension.indexOf(tagId), 1)
      }
      if (nowChoosedTagsIds.indexOf(tagId) > -1) {
        nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(tagId), 1)
      }
      const nowChoosedTags = this.transTagIDsToName(nowChoosedTagsIds)
      this.setState({
        nowChoosedTags,
        nowChoosedTagsIds,
        nowChoosedTagsIdInNowDimension
      })
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
        title={'新增标签'}
        visible={this.props.addTagVisible}
        onCancel={this.props.addTagCancel}
        onOk={(e) => this.handleSubmit(e)}
        width={800}
        destroyOnClose={true}
        zIndex={1000}
      >
        <div style={{ maxHeight: 550, overflowY: 'auto' }}>
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
              <div className="add-tag-name">
                {
                  this.state.activeChoiceType === 1 ?
                    <RadioGroup
                      defaultValue={this.state.nowChoosedTagsIdInNowDimension[0]}
                      value={this.state.nowChoosedTagsIdInNowDimension[0]}
                    >
                      {this.state.nowAllTags.map((item, index) => {
                        return (
                          <Radio key={item.id} value={item.id}
                            onClick={this.handleChoseTag}>{item.name}</Radio>
                        )
                      })}
                    </RadioGroup>
                    :
                    <Checkbox.Group
                      defaultValue={this.state.nowChoosedTagsIdInNowDimension}
                      value={this.state.nowChoosedTagsIdInNowDimension}
                    >
                      {this.state.nowAllTags.map((item, index) => {
                        return (
                          <Checkbox
                            style={{ marginLeft: 0, marginRight: 8 }}
                            key={item.id}
                            value={item.id}
                            onClick={this.handleChoseTag}
                          >
                            {item.name}
                          </Checkbox>
                        )
                      })}
                    </Checkbox.Group>
                }
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已选标签"
            >
              <div className="tag-set">
                {
                  this.state.nowChoosedTags.map((item) => {
                    return (
                      <Tag key={item.id} color="#f50"
                        closable
                        onClose={() => this.deleteTag(item.id)}
                      >{item.name}</Tag>
                    )
                  })
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
