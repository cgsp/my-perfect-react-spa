import React, { Component } from 'react'
import { Button, Form, Input, message, Select, Switch, Modal } from 'antd'
import { apiChildParter } from '@Api/child-table'
import { ERR_OK } from '@Constants'
import { moduleNameList } from '../config'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from '../drag/column'
import './style.scss'
import { transNameToModule } from '@Utils/transNameToModule'
import { getMaxTaskId } from '@Utils/getMaxTaskId'
import { judgeLimitOneModule } from '@Utils/judgeLimitOneModule'
import { getModulesItemValue } from '@Utils/getModulesItemValue'
import { isRepeatArr } from '@Utils/isRepeatArr'


const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const Confirm = Modal.confirm


class ChildTableAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      parterSelectData: [],
      moduleNameList,
      dragData: {
        tasks: {},
        columns: {
          'column-1': {
            id: 'column-1',
            title: '模块设置',
            taskIds: [],
          }
        },
        columnOrder: ['column-1']
      }
    }

    // 最终表单的数据
    this.options = {}

    // 模糊匹配
    this.handleParterSelectChange = this.handleParterSelectChange.bind(this)
    this.handleParterSelectSearch = this.handleParterSelectSearch.bind(this)
    this.timeout = null
    this.currentAccount = ''
    // 删除模块
    this.deleteModule = this.deleteModule.bind(this)
  }

  // 左侧表单的提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.setState({
      }, () => {
        const {
          appKey,
          toastWhenTrackPlayingStartInMsMinute,
          toastWhenTrackPlayingStartInMsSecond } = this.state
        // if (!appKey) {
        //   message.error('请选择合作方')
        //   return
        // }
        let toastWhenTrackPlayingStartInMs
        // 如果选择了弹框提示app，则必须选择类型和频率
        if (values.toastWhenTrackPlayingTurnon) {
          if (!toastWhenTrackPlayingStartInMsSecond && !toastWhenTrackPlayingStartInMsMinute) {
            message.error('请输入弹出时间点')
            return
          }
          if (!toastWhenTrackPlayingStartInMsMinute) {
            toastWhenTrackPlayingStartInMs = toastWhenTrackPlayingStartInMsSecond - 0
          } else {
            if (!toastWhenTrackPlayingStartInMsSecond) {
              toastWhenTrackPlayingStartInMs = (toastWhenTrackPlayingStartInMsMinute - 0) * 60
            } else {
              toastWhenTrackPlayingStartInMs = (toastWhenTrackPlayingStartInMsMinute - 0) * 60 + (toastWhenTrackPlayingStartInMsSecond - 0)
            }
          }
        } else {
          values.toastWhenTrackPlayingType = ''
          toastWhenTrackPlayingStartInMs = ''
        }
        // 基本信息
        const site = {
          siteName: values.siteName,
          appKey,
          description: values.description,
          enableCopyrightFilter: values.enableCopyrightFilter,
          extendConfigJson: {
            soundPatch: values.soundPatch,
            toastInAlbumDetailPage: values.toastInAlbumDetailPage,
            toastWhenTrackPlaying: {
              turnon: values.toastWhenTrackPlayingTurnon,
              type: values.toastWhenTrackPlayingType,
              startInMs: toastWhenTrackPlayingStartInMs
            }
          }
        }
        const { taskIds } = this.state.dragData.columns['column-1']
        const { tasks } = this.state.dragData
        const modules = getModulesItemValue(values, taskIds, tasks)
        const options = {
          site,
          categories: [],
          modules
        }
        if (options.modules.length === 0 && options.categories.length === 0) {
          message.error('请至少选择一个模块')
          return
        }
        // 优惠券如果出现了2个，那么2个一个必须是首页弹出，一个必须是固定显示
        let youhuiNum = 0
        let youhuiStyleArr = []
        let huiyuanLingquNum = 0
        let huiyuanLingquStyleArr = []
        options.modules.forEach(item => {
          if (item.moduleType === 13) {
            youhuiNum += 1
            youhuiStyleArr.push(JSON.parse(item.context).style)
          }
          if (item.moduleType === 14) {
            huiyuanLingquNum += 1
            huiyuanLingquStyleArr.push(JSON.parse(item.context).style)
          }
        })
        if (youhuiNum >= 3) {
          message.error('优惠券模块，最多出现2个')
          return
        }
        if (huiyuanLingquNum >= 3) {
          message.error('会员领取模块，最多出现2个')
          return
        }
        if (isRepeatArr(youhuiStyleArr)) {
          message.error('优惠券模块，最多出现2个,且展示形式应不同')
          return
        }
        if (isRepeatArr(huiyuanLingquStyleArr)) {
          message.error('会员领取模块，最多出现2个,且展示形式应不同')
          return
        }
        console.log(options)
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

  // 返回
  goBack = () => {
    this.props.history.push({
      pathname: '/child-table',
    })
  }

  // 拖拽
  onDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    this.setState({}, () => {
      const column = this.state.dragData.columns[source.droppableId]
      const newTakIds = Array.from(column.taskIds)
      newTakIds.splice(source.index, 1)
      newTakIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...column,
        taskIds: newTakIds
      }

      const newState = {
        ...this.state.dragData,
        columns: {
          ...this.state.dragData.columns,
          [newColumn.id]: newColumn,
        }
      }
      console.log(newState.columns['column-1']
        .taskIds)
      // console.log(newState)
      this.setState({
        dragData: newState
      })
    })
  }

  // 点击添加模块
  addModule = (name) => {
    const that = this
    Confirm({
      title: `确定添加 ${name} 模块吗？`,
      content: '',
      onOk() {

        that.setState({}, () => {
          let oldDragData = that.state.dragData
          oldDragData = JSON.parse(JSON.stringify(oldDragData))
          const taskContent = transNameToModule(name)
          const limit = judgeLimitOneModule(taskContent, oldDragData.tasks)
          if (limit) {
            message.error('提示下载App, 搜索条件，分类Tab模块，分别只能添加一次')
            return
          }
          const taskId = `task-${getMaxTaskId(oldDragData.tasks) + 1}`

          oldDragData.tasks[taskId] = {
            taskId,
            content: taskContent
          }
          oldDragData.columns['column-1'].taskIds.unshift(taskId)
          console.log(oldDragData)
          that.setState({
            dragData: oldDragData
          })
        })
      }
    })
  }

  // 删除模块
  deleteModule = (taskId) => {
    const that = this
    Confirm({
      title: '确定删除该模块吗？',
      content: '',
      onOk() {
        that.setState({}, () => {
          let oldDragData = that.state.dragData
          oldDragData = JSON.parse(JSON.stringify(oldDragData))
          delete oldDragData.tasks[taskId]
          const taskIds = oldDragData.columns['column-1'].taskIds.slice()
          const deleteIndex = taskIds.indexOf(taskId)
          oldDragData.columns['column-1'].taskIds.splice(deleteIndex, 1)
          // console.log(oldDragData)
          that.setState({
            dragData: oldDragData
          })
        })
      }
    })
  }

  render() {
    const taskLength = this.state.dragData.columns['column-1'].taskIds.length
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
    const formItemLayoutTextLong = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    let toastWhenTrackPlayingTurnon = this.props.form.getFieldsValue().toastWhenTrackPlayingTurnon
    if (toastWhenTrackPlayingTurnon === undefined) {
      toastWhenTrackPlayingTurnon = true
    }
    return (
      <div className="child-table-add">
        <div className="title">
          <div className="text">子站管理/</div>
          <div className="function">新建子站</div>
          <div className="back">
            <Button type="primary" onClick={this.goBack}>返回</Button>
          </div>
        </div>
        <div className="content">
          <Form
            onSubmit={this.handleSubmit}
            className="form"
          >
            <div className="body">
              <div className="left">
                <div className="basic">
                  <div className="content-title">
                    基本信息
                  </div>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <label className="ant-form-item-required">合作方:</label>
                    }
                    colon={false}
                  >
                    <Select
                      showSearch
                      placeholder="请输入合作方"
                      allowClear={true}
                      value={this.state.appKey}
                      onSearch={this.handleParterSelectSearch}
                      onChange={this.handleParterSelectChange}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={'根据此关键字，无法搜索'}
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
                    {
                      getFieldDecorator('siteName', {
                        initialValue: undefined,
                        rules: [
                          {
                            required: true,
                            message: '请输入子站名称',
                          },
                          {
                            max: 20,
                            message: '子站名称应该小于20个字符',
                          }
                        ]
                      })(
                        <Input placeholder="请输入子站名称" onPressEnter={e => e.preventDefault()} />
                      )
                    }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="子站简介"
                  >
                    {
                      getFieldDecorator('description', {
                        initialValue: undefined,
                        rules: [
                          {
                            required: true,
                            message: '请输入子站简介',
                          },
                          {
                            max: 200,
                            message: '子站简介应该小于200个字符',
                          }
                        ]
                      })(
                        <TextArea
                          style={{ height: 100, maxHeight: 100 }}
                          placeholder="请输入子站简介"
                        />
                      )
                    }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="版权过滤"
                  >
                    {getFieldDecorator('enableCopyrightFilter',
                      {
                        valuePropName: 'checked',
                        initialValue: true,
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ]
                      },
                    )(
                      <Switch />
                    )}
                  </FormItem>
                </div>
                <div className="add-module">
                  <div className="content-title">
                    添加模块
                  </div>
                  <FormItem
                    className="click-to-add-box"
                    labelCol={{
                      xs: { span: 24 },
                      sm: { span: 4 },
                    }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 20 },
                    }}
                    label={
                      <label className="ant-form-item-required">点击添加</label>
                    }
                    colon={false}
                  >
                    <div className="click-to-add">
                      {
                        this.state.moduleNameList.map((item, index) => {
                          return (
                            <Button className="add-button" icon="plus" type="primary" key={index} onClick={() => this.addModule(item.name)}>
                              {item.name}
                            </Button>
                          )
                        })
                      }
                    </div>
                  </FormItem>
                  <FormItem
                    {...formItemLayoutTextLong}
                    label="底部Tab"
                  >
                    {getFieldDecorator('dockTab',
                      {
                        valuePropName: 'checked',
                        initialValue: true,
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ]
                      },
                    )(
                      <Switch />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutTextLong}
                    label="声音贴片提示下载app"
                  >
                    {getFieldDecorator('soundPatch',
                      {
                        valuePropName: 'checked',
                        initialValue: false,
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ]
                      },
                    )(
                      <Switch />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutTextLong}
                    label="专辑详情页提示下载app："
                  >
                    {getFieldDecorator('toastInAlbumDetailPage',
                      {
                        valuePropName: 'checked',
                        initialValue: false,
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ]
                      },
                    )(
                      <Switch />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayoutTextLong}
                    label="弹框提示下载app："
                  >
                    {getFieldDecorator('toastWhenTrackPlayingTurnon',
                      {
                        valuePropName: 'checked',
                        initialValue: true,
                        rules: [
                          {
                            required: true,
                            message: '必填',
                          },
                        ]
                      },
                    )(
                      <Switch />
                    )}
                  </FormItem>
                  {
                    toastWhenTrackPlayingTurnon ?
                      <FormItem
                        {...formItemLayout}
                        label="出现频率"
                      >
                        {getFieldDecorator('toastWhenTrackPlayingType', {
                          initialValue: 1,
                          rules: [
                            {
                              required: true, message: '请选择出现频率',
                            }
                          ],
                        })(
                          <Select allowClear>
                            <Option value={1}>页面第一次点击播放声音</Option>
                            <Option value={2}>每条声音</Option>
                          </Select>
                        )}
                      </FormItem> : null
                  }
                  {
                    toastWhenTrackPlayingTurnon ?
                      <FormItem
                        {...formItemLayout}
                        label={<label className="ant-form-item-required">弹出时间点</label>}
                      >
                        <div>
                          <div className="tan-time">
                            <span>第</span>
                            <Input
                              className="input"
                              type="number"
                              onChange={(e) => {
                                this.setState({
                                  toastWhenTrackPlayingStartInMsMinute: e.target.value
                                })
                              }}
                            />
                            <span>分</span>
                          </div>
                          <div className="tan-time">
                            <span>第</span>
                            <Input
                              className="input"
                              type="number"
                              onChange={(e) => {
                                this.setState({
                                  toastWhenTrackPlayingStartInMsSecond: e.target.value
                                })
                              }}
                            />
                            <span>秒</span>
                          </div>
                        </div>
                      </FormItem> : null
                  }
                </div>
              </div>
              <div className="right">
                {
                  taskLength === 0 ?
                    <div className="no-module">请添加模块</div>
                    :
                    <DragDropContext
                      onDragEnd={this.onDragEnd}
                      className="right"
                    >
                      {
                        this.state.dragData.columnOrder.map(columnId => {
                          const column = this.state.dragData.columns[columnId]
                          const tasks = column.taskIds.map(taskId => this.state.dragData.tasks[taskId])
                          return (
                            <Column
                              key={column.id}
                              column={column}
                              tasks={tasks}
                              deleteModule={this.deleteModule}
                              getFieldDecorator={getFieldDecorator}
                            />
                          )
                        })
                      }
                    </DragDropContext>
                }
              </div>
              <div className="submit">
                <FormItem className="submit-button">
                  <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </div >
    )
  }
}

const WrapperChildTableAdd = Form.create()(ChildTableAdd)
export default WrapperChildTableAdd
