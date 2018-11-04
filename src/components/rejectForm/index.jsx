import React from 'react'
import {
  Form,
  Input
} from 'antd'
const { TextArea } = Input
const { Item } = Form
const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

class Reject extends React.Component {

  render() {
    const { label, msg, label2, msg2 } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form layout="inline">
          <Item {...formLayout} label={label} style={{ display: 'block' }}>
            {getFieldDecorator('auditFailReason', {
              rules: [
                {
                  required: true,
                  message: msg
                }
              ]
            })(
              <TextArea rows={4} />
            )}
          </Item>

          {label2 && <Item {...formLayout} label={label2} style={{ display: 'block' }}>
            {getFieldDecorator('auditFailReason', {
              rules: [
                {
                  required: true,
                  message: msg2
                }
              ]
            })(<span>请上传</span>)}
          </Item>}
        </Form>
      </div>
    )
  }
}
const RejectForm = Form.create()(Reject)
export default RejectForm
