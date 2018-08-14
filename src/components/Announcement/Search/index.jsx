import React from 'react'
import {
    Form,
    Input,
    Button,
} from 'antd'
import {inject,observer} from 'mobx-react'
const {Item} = Form


@inject('announcement')
@observer
class FormSearch extends React.Component {

    handleSubmit = (e) => {
        const {currentPage} = this.props
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_no = currentPage
            values.page_size = 10
            this.props.announcement.fetchAnnounceData(values)
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="公告标题">
                        {getFieldDecorator('title')(<Input style={{width: 220}} autoComplete="off"/>)}
                    </Item>
                    <Item style={{marginLeft: 20}}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Item>
                </Form>
            </div>
        )
    }
}
const AnnounceFormSearch = Form.create()(FormSearch)
export default AnnounceFormSearch