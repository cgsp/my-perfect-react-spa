import React from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  Cascader
} from 'antd'
import { inject, observer } from 'mobx-react'
import api, { http } from './../../../service'
import { sessionCache } from '../../../utils/cache'
import { formatAddress } from '../../../utils/index'
const { Item } = Form
const { Option } = Select
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

@inject('helpContent')
@observer
class FormSearch extends React.Component {
  state = {
    treeCategory: [],
  }
  componentWillMount() {
    this.fetchCategoryTree()
  }

  fetchCategoryTree = () => {
    http.get(api.QACATETREE).then((res) => {
      const data = res.data || {}
      const { code, message } = data
      if (code === 0) {
        const treeData = formatAddress(data.data)
        sessionCache.put('treeCategory', treeData || [])
        treeData.unshift({ id: -1, name: '全部', children: [], value: -1, label: '全部' })
        this.setState({ treeCategory: treeData })
      } else {
        message.error(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      let categoryId = values.category_id
      if (categoryId && categoryId.length > 0) {
        categoryId = categoryId[categoryId.length - 1]
        values.category_id = categoryId
      }
      this.props.handleCurrentPage()
      values.page_no = 1
      values.page_size = 10
      sessionCache.put('content_value', values)
      this.props.helpContent.fetchHelpConData(values)
    })
  }
  changeId = (id) => {
    console.log(id)
    sessionCache.put('categoryIdArr', id || [])
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const { treeCategory } = this.state
    const { serchCondition } = this.props
    const categoryIdArr = sessionCache.get('categoryIdArr') || []
    if (categoryIdArr.length === 1 && categoryIdArr[0] === serchCondition.category_id) {
      serchCondition.category_id = categoryIdArr
    } else if (categoryIdArr.length === 2 && categoryIdArr[1] === serchCondition.category_id) {
      serchCondition.category_id = categoryIdArr
    }
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Item style={{ marginLeft: 30 }} label="问题标题">
            {getFieldDecorator('title', {
              initialValue: serchCondition.title
            })(<Input style={{ width: 220 }} autoComplete="off" />)}
          </Item>
          <FormItem
            {...formItemLayout}
            label="所属分类"
            style={{ marginLeft: 20 }}
            className='help-content-tree'
          >
            {getFieldDecorator('category_id', {
              initialValue: serchCondition.category_id || undefined
            })(
              <Cascader options={treeCategory}
                placeholder="请选择一级和二级分类"
                style={{ width: 200 }}
                allowClear={false}
                onChange={this.changeId}
              />
            )}
          </FormItem>
          <Item style={{ marginLeft: 20 }} label="状态">
            {getFieldDecorator('online_status', {
              initialValue: serchCondition.online_status || undefined
            })(
              <Select placeholder="请选择状态" style={{ width: 160 }}>
                <Option value={-1}> 全部 </Option>
                <Option value={1}> 上线 </Option>
                <Option value={0}> 下线 </Option>
              </Select>
            )}
          </Item>
          <Item style={{ marginLeft: 20 }}>
            <Button type="primary" htmlType="submit" >
              查询
                        </Button>
          </Item>
        </Form>
      </div>
    )
  }
}
const ConFormSearch = Form.create()(FormSearch)
export default ConFormSearch
