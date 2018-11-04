import React from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    InputNumber
} from 'antd'
import {inject, observer} from 'mobx-react'
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

@inject('catagories')
@observer
class AddAndEdit extends React.Component {

  render() {
     const {getFieldDecorator} = this.props.form
        const { isAddContentModel,handleContentModalOk,closeContentModal, maxOrderNum,editData, confirmButton} = this.props
        return (
            <div>
                <Form onSubmit={handleContentModalOk}>
                    <Item {...formLayout} label="文档分类">
                        {getFieldDecorator('categoryName', {
                            initialValue: editData.categoryName,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写文档分类'
                                }
                            ]
                        })(<Input autoComplete="off"/>)}
                    </Item>
                    <Item {...formLayout} label="序号" help={`序号范围为1到${isAddContentModel ? Number(maxOrderNum)+1: maxOrderNum}`}>
                        {getFieldDecorator('orderNum', {
                            initialValue: editData.orderNum,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写序号'
                                }
                            ]
                        })(<InputNumber min={1} max={ isAddContentModel ? Number(maxOrderNum)+1: maxOrderNum }
                                        placeholder="请填写序号" style={{width: 110}}/>)}
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
                    <Item style={{marginLeft:300}}>
                        <Button type="primary"
                                htmlType="submit"
                                className="buttonLen"
                                style={{marginRight:15}}
                                disabled = {confirmButton}
                        >
                            确定
                        </Button>
                        <Button type="primary" ghost onClick={closeContentModal} >
                            取消
                        </Button>

                    </Item>
                </Form>
            </div>
        )
    }
}
const AddAndEditForm = Form.create()(AddAndEdit)
export default AddAndEditForm