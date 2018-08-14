import React from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    InputNumber,
    Select
} from 'antd'
const {Item} = Form
const {Group} = Radio
const {Option} = Select
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
}

class AddAndEdit extends React.Component {
    showCatagoriesAll = () =>{
        const data =this.props.data
        return (data && data.length >0  && data.map((item,index)=>{
            return (
                <Option value={item.id} className='test' key={item.id}>{item.name}</Option>
            )
        }))
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const { isAddContentModel,handleContentModalOk,closeContentModal, secMaxOrderNum,editData,handleCurrencyChange, confirmStatus} = this.props
        return (
            <div>
                <Form onSubmit={handleContentModalOk}>
                        <Item {...formLayout} label="帮助二级分类">
                            { getFieldDecorator('categoryName', {
                                initialValue: editData.title,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入帮助二级分类'
                                    }
                                ]
                            } ) ( <Input autoComplete="off"/> ) }
                        </Item>
                        <Item {...formLayout} label="所属一级分类">
                            {getFieldDecorator('parentId', {
                                initialValue: editData.parentId,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择一级分类'
                                    }
                                ]
                            })(
                                <Select placeholder="请选择分类" style={{width: 220}} onChange = {handleCurrencyChange}>
                                    {this.showCatagoriesAll()}
                                </Select>
                            )}
                        </Item>
                        <Item {...formLayout} label="序号" help={secMaxOrderNum ? isAddContentModel ? `请在1到${secMaxOrderNum+1}中选择` : `请在1到${secMaxOrderNum}中选择` : ''}>
                            {getFieldDecorator('orderNum', {
                                initialValue: editData.orderNum,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择序号'
                                    }
                                ]
                            })( <InputNumber min={1} max={isAddContentModel ? secMaxOrderNum+1 : secMaxOrderNum} placeholder = "请填写序号" style = {{width: 110}} />) }
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
const HelpSecAddAndEdit = Form.create()(AddAndEdit)
export default HelpSecAddAndEdit