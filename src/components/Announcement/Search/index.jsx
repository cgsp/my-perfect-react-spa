import React from 'react'
import {
    Form,
    Input,
    Button,
} from 'antd'
import {inject,observer} from 'mobx-react'
import {sessionCache} from '../../../utils/cache'
const {Item} = Form


@inject('announcement')
@observer
class FormSearch extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.currentPageNum()
        this.props.form.validateFieldsAndScroll((errors, values) => {
            values.page_no = 1
            values.page_size = 10
            sessionCache.put('announce_value', values)
            this.props.announcement.fetchAnnounceData(values)
        })
    }



    render() {
        const {getFieldDecorator} = this.props.form
        const {title} = this.props
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Item style={{marginLeft: 30}} label="公告标题">
                        {getFieldDecorator('title',{
                            initialValue: title
                        })(<Input style={{width: 220}} autoComplete="off"/>)}
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