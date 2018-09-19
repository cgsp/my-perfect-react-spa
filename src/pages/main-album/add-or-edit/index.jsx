import React, { Component } from 'react'
import { Modal, Form, Input, message, Select, Button, Tag } from 'antd'
import { PropTypes } from 'prop-types'
import WrapperSelfAddTag from '../add-tag'
import MaskLoading from '@Components/mask-loading'
import { connect } from 'react-redux'
import { ERR_OK } from '@Constants'
import { commonSmallTypes } from '@Api'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input


@connect(
  state => state.commonTagAndDimesionsReducer,
  {}
)
class SelfTagDimensionAddOrEdit extends Component {
  static propTypes = {
    addOrEditVisible: PropTypes.bool,
    addOrEditInitValues: PropTypes.object,
    addOrEditOk: PropTypes.func,
    addOrEditCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { coverUrlMiddle, coverUrlLarge, coverUrlSmall, ctagIds } = this.props.addOrEditInitValues
    const nowChoosedTagsIds = ctagIds || []
    // 根据传入的标签ID，获取标签名称
    const nowChoosedTags = this.transTagIDsToName(nowChoosedTagsIds)
    this.state = {
      addTagVisible: false,
      smallTypes: [],
      nowChoosedTags,
      nowChoosedTagsIds,
      coverUrlMiddle,
      coverUrlLarge,
      coverUrlSmall,
    }
    this.addTagCancel = this.addTagCancel.bind(this)
    this.addTagOk = this.addTagOk.bind(this)
  }

  componentDidMount() {
    this.getSmallTypes('1')
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

  getSmallTypes = async (source) => {
    try {
      if (!source) {
        this.setState({
          smallTypes: []
        })
        this.props.form.setFieldsValue({
          categoryId: undefined
        })
      }
      const smallTypeRes = await commonSmallTypes(source)
      if (smallTypeRes.code !== ERR_OK) {
        message.error(smallTypeRes.msg)
        return
      }
      this.setState({
        smallTypes: smallTypeRes.data
      })
    } catch (error) {
      console.log(error)
    }
  }

  sourceChange = (source) => {
    this.getSmallTypes(source)
    this.props.form.setFieldsValue({
      categoryId: undefined
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.setState({}, () => {
        const { nowChoosedTagsIds, coverUrlLarge, coverUrlSmall, coverUrlMiddle } = this.state
        values.ctagIds = nowChoosedTagsIds.join()
        // 后面删除这句
        values.coverUrlLarge = coverUrlLarge ? coverUrlLarge : ''
        values.coverUrlMiddle = coverUrlMiddle ? coverUrlMiddle : ''
        values.coverUrlSmall = coverUrlSmall ? coverUrlSmall : ''

        values.tags = this.tags
        if (typeof values.trackIds !== 'string') {
          values.trackIds = values.trackIds.join()
        }

        values.paid = values.isPaid
        // 后面删除这句
        values.people = values.people ? values.people : ''
        if (nowChoosedTagsIds.length === 0) {
          message.error('请至少选择一个自运营标签')
          return
        }
        values.categorySource = values.categorySource - 0
        values.sourceId = values.sourceId - 0
        this.props.addOrEditOk(values)
        console.log(values)
      })
    })
  }

  addTagCancel() {
    this.setState({
      addTagVisible: false
    })
  }

  deleteTag = (id) => {
    console.log(id)
    this.setState({
    }, () => {
      const { nowChoosedTagsIds, nowChoosedTags } = this.state
      nowChoosedTagsIds.splice(nowChoosedTagsIds.indexOf(id), 1)
      const index = nowChoosedTags.findIndex(item => item.id === id)
      nowChoosedTags.splice(index, 1)
      this.setState({
        nowChoosedTagsIds,
        nowChoosedTags
      })
    })
  }

  addTagBegin = () => {
    this.setState({
      addTagVisible: true
    })
  }

  addTagOk = (nowChoosedTagsIds) => {
    // 根据传入的标签ID，获取标签名称
    nowChoosedTagsIds = nowChoosedTagsIds.slice()
    const nowChoosedTags = this.transTagIDsToName(nowChoosedTagsIds).slice()
    this.setState({
      addTagVisible: false,
      nowChoosedTagsIds,
      nowChoosedTags
    })
  }
  addTagCancel = () => {
    this.setState({
      addTagVisible: false
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

    const addTagOptions = {
      addTagVisible: this.state.addTagVisible,
      addTagOk: this.addTagOk,
      addTagCancel: this.addTagCancel,
      nowChoosedTagsIds: this.state.nowChoosedTagsIds.slice()
    }

    return (
      <Modal
        title="另存为自运营专辑"
        visible={this.props.addOrEditVisible}
        onCancel={this.props.addOrEditCancel}
        onOk={(e) => this.handleSubmit(e)}
        destroyOnClose={true}
        width={600}
      >
        <div style={{ maxHeight: 550, overflowY: 'scroll' }}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="主站专辑ID"
            >
              <Input type="text" value={this.props.addOrEditInitValues.id} disabled />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="专辑标题"
            >
              {
                getFieldDecorator('title', {
                  initialValue: this.props.addOrEditInitValues.title,
                  rules: [
                    {
                      required: true,
                      message: '请输入专辑标题',
                    },
                    {
                      max: 20,
                      message: '专辑标题应该小于20个字符',
                    }
                  ]
                })(
                  <Input placeholder="请输入专辑标题" onPressEnter={e => e.preventDefault()} />
                )
              }
            </FormItem>
            {
              this.state.coverUrlMiddle ? <FormItem
                {...formItemLayout}
                label="专辑封面"
              >
                <div>
                  <img src={this.state.coverUrlMiddle} alt="封面" width="100" height="100" />
                </div>
              </FormItem> :
                null
            }
            <FormItem
              {...formItemLayout}
              label="分类来源"
            >
              {getFieldDecorator('categorySource', {
                initialValue: this.props.addOrEditInitValues.categorySource ? this.props.addOrEditInitValues.categorySource + '' : '1',
                rules: [
                  {
                    required: true, message: '请选择分类来源',
                  }
                ],
              })(
                <Select
                  allowClear
                  getPopupContainer={trigger => trigger.parentNode}
                  onChange={(v) => this.sourceChange(v)}>
                  <Option value="1">主站分类</Option>
                  <Option value="2">自运营分类</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类"
            >
              {getFieldDecorator('categoryId', {
                initialValue: this.props.addOrEditInitValues.categoryId,
                rules: [
                  {
                    required: true, message: '请选择分类',
                  }
                ],
              })(
                <Select
                  allowClear
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  {
                    this.state.smallTypes.map((item) => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))
                  }

                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="自运营标签"
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
                <div>
                  <Button type="primary" onClick={this.addTagBegin}>添加标签</Button>
                </div>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上下架状态"
            >
              {getFieldDecorator('onlineStatus', {
                initialValue: this.props.addOrEditInitValues.onlineStatus ? this.props.addOrEditInitValues.onlineStatus : 1,
              })(
                <Select disabled>
                  <Option value={1}>已上架</Option>
                  <Option value={0}>已下架</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="主讲人"
            >
              {getFieldDecorator('people', {
                initialValue: this.props.addOrEditInitValues.people,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否付费"
            >
              {getFieldDecorator('isPaid', {
                initialValue: this.props.addOrEditInitValues.isPaid,
              })(
                <Select disabled>
                  <Option value={1}>付费</Option>
                  <Option value={0}>免费</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="价格类型"
            >
              {getFieldDecorator('priceType', {
                initialValue: this.props.addOrEditInitValues.priceType,
              })(
                <Select disabled>
                  <Option value={1}>单集购买</Option>
                  <Option value={2}>整张购买</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="专辑简介"
            >
              {getFieldDecorator('intro', {
                initialValue: this.props.addOrEditInitValues.intro,
                rules: [
                  {
                    required: true,
                    message: '请输入专辑简介',
                  }
                ]
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} placeholder="请输入专辑简介" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="专辑内容"
            >
              {getFieldDecorator('trackIds', {
                initialValue: this.props.addOrEditInitValues.trackIds ? this.props.addOrEditInitValues.trackIds.join() : '',
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} disabled />
              )}
            </FormItem>
          </Form>
          {
            this.state.addTagVisible
              ?
              <WrapperSelfAddTag {...addTagOptions} />
              : null
          }
          <MaskLoading ref="mask" />

        </div>
      </Modal >
    )
  }
}

const WrapperSelfTagDimensionAddOrEdit = Form.create()(SelfTagDimensionAddOrEdit)
export default WrapperSelfTagDimensionAddOrEdit
