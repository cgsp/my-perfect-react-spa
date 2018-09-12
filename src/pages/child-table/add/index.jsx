import React, { Component } from 'react'
import { Button, Form, Input } from 'antd'
import './style.scss'

const FormItem = Form.Item

class ChildTableAdd extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      console.log(values)
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
            className="form"
            onSubmit={this.handleSubmit}
          >
            <div className="body">
              <div className="left">
                <FormItem
                  {...formItemLayout}
                  label="子站标题"
                >
                  {
                    getFieldDecorator('title', {
                      initialValue: '22222',
                      rules: [
                        {
                          required: true,
                          message: '请输入子站标题',
                        },
                        {
                          max: 20,
                          message: '子站标题应该小于20个字符',
                        }
                      ]
                    })(
                      <Input placeholder="请输入子站标题" onPressEnter={e => e.preventDefault()} />
                    )
                  }
                </FormItem>
              </div>
              <div className="right">右边</div>
            </div>

            <div className="submit">
              <FormItem>
                <Button type="primary" htmlType="submit">保存</Button>
              </FormItem>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const WrapperChildTableAdd = Form.create()(ChildTableAdd)
export default WrapperChildTableAdd
