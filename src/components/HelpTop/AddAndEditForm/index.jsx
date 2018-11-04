import React from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    InputNumber
} from 'antd'
const {Item} = Form
const {Group} = Radio
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
}

class AddAndEdit extends React.Component {

    render() {
        const {getFieldDecorator} = this.props.form
        const { isAddContentModel,handleContentModalOk,closeContentModal, maxOrderNum,editData, confirmStatus} = this.props


        return (
            <div>
                <Form onSubmit={handleContentModalOk}>
                    <Item {...formLayout} label="帮助一级分类">
                        {getFieldDecorator('categoryName', {
                            initialValue: editData.categoryName,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入帮助一级分类'
                                }
                            ]
                        })(<Input placeholder="请输入帮助一级分类" autoComplete="off"/>)}
                    </Item>
                    <Item {...formLayout} label="序号" help= {`请在1到${isAddContentModel? maxOrderNum+1 : maxOrderNum}之间选择`}>
                        {getFieldDecorator('orderNum', {
                            initialValue: editData.orderNum,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写序号'
                                }
                            ]
                        })(<InputNumber min={1} max={isAddContentModel? maxOrderNum+1 : maxOrderNum} placeholder="请填写序号" style={{ width: 110 }} />)}
                    </Item>
                    <Item {...formLayout} label="状态">
                        {getFieldDecorator('onlineStatus', {
                            initialValue: editData.onlineStatus,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择状态'
                                }
                            ]
                        })(
                            <Group>
                                <Radio value={1}>上线</Radio>
                                <Radio value={0}>下线</Radio>
                            </Group>
                        )}
                    </Item>
                    <Item className="button" style={{ marginLeft: 300 }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 30 }} disabled = {confirmStatus}>
                            确定
                        </Button>
                        <Button type="primary" ghost onClick={closeContentModal}>
                            取消
                        </Button>
                    </Item>
                </Form>
            </div>
        )
    }
}
const HelpAddAndEdit = Form.create()(AddAndEdit)
export default HelpAddAndEdit