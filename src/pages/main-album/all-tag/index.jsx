import React, { Component } from 'react'
import { Modal, Form, Input, message, Button, Tag } from 'antd'
import { PropTypes } from 'prop-types'
import WrapperSelfAddTag from '../add-tag'
import { connect } from 'react-redux'
import { myHuanHang } from '@Utils/myHuanHang'

const FormItem = Form.Item
const { TextArea } = Input


@connect(
  state => state.commonTagAndDimesionsReducer,
  {}
)
class MainAllTag extends Component {
  static propTypes = {
    allTagVisible: PropTypes.bool,
    allTagOk: PropTypes.func,
    allTagCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const nowChoosedTagsIds = []
    const nowChoosedTags = []
    this.state = {
      addTagVisible: false,
      nowChoosedTags,
      nowChoosedTagsIds,
    }
    this.addTagCancel = this.addTagCancel.bind(this)
    this.addTagOk = this.addTagOk.bind(this)
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

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.setState({}, () => {
        const { nowChoosedTagsIds } = this.state
        let { albumIds } = values

        albumIds = myHuanHang(albumIds)
        if (!albumIds.length) {
          message.error('请至少输入一个专辑ID')
          return
        }
        if (!nowChoosedTagsIds.length) {
          message.error('请至少选择一个自运营标签')
          return
        }

        values.albumIds = values.albumIds.split('\n')

        let newArr = []
        for (let index = 0; index < values.albumIds.length; index++) {
          let element = values.albumIds[index]
          newArr.push(element - 0)
        }

        const options = { albumIds: [...new Set(newArr)], tagIds: nowChoosedTagsIds }
        this.props.allTagOk(options)
        // console.log(options)
      })
    })
  }

  addTagCancel() {
    this.setState({
      addTagVisible: false
    })
  }

  addTagOk(values) {
    this.addTagCancel()
  }

  deleteTag = (id) => {
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
        title={'批量打标签'}
        visible={this.props.allTagVisible}
        onCancel={this.props.allTagCancel}
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
              label="专辑ID"
            >
              {getFieldDecorator('albumIds', {
                rules: [
                  {
                    required: true, message: '请输入专辑ID',
                  }
                ]
              })(
                <TextArea style={{ height: 100, maxHeight: 100 }} placeholder="请换行输入专辑ID" />
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
          </Form>
          {
            this.state.addTagVisible
              ?
              <WrapperSelfAddTag {...addTagOptions} />
              : null
          }
        </div>
      </Modal >
    )
  }
}

const WrapperMainAllTag = Form.create()(MainAllTag)
export default WrapperMainAllTag
