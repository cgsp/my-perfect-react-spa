import React from 'react'
import {
    Form,
    Button,
    Input
} from 'antd'
import {inject,observer} from 'mobx-react'
const {TextArea} = Input
const {Item} = Form
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
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline">
                    <Item {...formLayout} label="审核驳回意见" className="reject-textArea">
                        {getFieldDecorator('auditFailReason', {
                            rules: [
                                {
                                    required: true,
                                    message:'请填写审核驳回意见'
                                }
                            ]
                        })(<TextArea rows={4}/>)}
                    </Item>
                </Form>
            </div>
        )
    }





}
const CommonReject = Form.create()(Reject)
export default CommonReject
