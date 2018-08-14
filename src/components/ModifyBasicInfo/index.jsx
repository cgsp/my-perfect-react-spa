import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Input, Button, Radio ,Modal} from 'antd'
import './style.scss'
import {sessionCache} from '../../utils/cache'
const Item = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 12
    }
}

const shortItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 8
    }
}

const buttonFromItemLayout = {
    wrapperCol: {
        offset: 4,
        span: 8
    }
}

const arr = {
    'MM':{
        2: {
            statusText: '',
        },
        3: {
            statusText: '审核已通过',


        },
        4: {
            statusText: '审核未通过',

        }
    },
    'MW':{
        2: {
            statusText: '',
        },
        3: {
            statusText: '审核已通过',


        },
        4: {
            statusText: '审核未通过',

        }
    },
}



@inject('developerAudit')
@Form.create({})
@observer
export default class BasicInfo extends Component {
    state = {
        isViewModel: false,
        textAreaStatus: true,
        value: ''
    }

    auditArr = []


    onChange = (checkedValues) => {
        if (checkedValues.target.value === '其他') {
            this.setState({
                textAreaStatus: false,
                value: checkedValues.target.value,
            })
        } else {
            this.setState({
                value: checkedValues.target.value,
                textAreaStatus: true,
            })
        }
    }

    handleCancel = () => {
        this.setState({
            isViewModel: false,
        })
    }

    componentWillMount() {
        const {basicAppInfo, mark} = this.props
        console.log('this.auditArr',basicAppInfo, mark)
        switch (mark) {
            case 'MM':
                this.auditArr = [
                    {label: '应用名称', value: basicAppInfo.appKey},
                    {label: '应用类型', value: basicAppInfo.appType},
                    {label: '所属开发者', value: basicAppInfo.developerName},
                    {label: '开发者类型', value: '不知道'},
                    {label: '应用简介', value: basicAppInfo.appDesc},
                    {label: '应用图标', value: <img src={basicAppInfo.appIcon} width="68" height="68"/>},
                    {label: '应用平台', value: '不知道'},
                    {label: 'Android APK包', value: basicAppInfo.androidPackageUrl},
                    {label: 'ios IPA包', value: basicAppInfo.iosPackageUrl},
                    {label: '应用截图', value: <img src={basicAppInfo.screenshotUrls} width="68" height="68"/>},
                ]
                break
            case 'MW':
                this.auditArr = [
                    {label: '应用名称', value: basicAppInfo.appKey},
                    {label: '应用类型', value: basicAppInfo.appType},
                    {label: '所属开发者', value: basicAppInfo.developerName},
                    {label: '开发者类型', value: '不知道'},
                    {label: '应用简介', value: basicAppInfo.appDesc},
                    {label: '应用图标', value: <img src={basicAppInfo.appIcon} width="68" height="68"/>},
                    {label: '网站地址', value: basicAppInfo.webAddress},
                    {label: '应用截图', value: <img src={basicAppInfo.screenshotUrls} width="68" height="68"/>},
                ]
                break
            default:
                this.auditArr = []
        }
    }

    render(){
        const {isViewModel, value, textAreaStatus,} = this.state
        const {handleCancel, onChange} = this
        const {submit,basicAppInfo, mark} = this.props

        return (
            <div className="basic-info">
                <Form>
                    <div className="basic-title">应用信息修改审批</div>
                    { (basicAppInfo.auditState != 2) ?
                        <div className="basic-status">
                            <div>
                                当前状态：<span>{arr[mark][basicAppInfo.auditState].statusText}</span>
                                审批人：<span>{basicAppInfo.auditor}</span>
                                {basicAppInfo.auditState === 4 &&
                                <div>未通过原因：<span>{basicAppInfo.auditFailReason}</span></div>}
                            </div>
                            <div>
                                审批时间：<span>{basicAppInfo.auditTime}</span>
                                申请时间：<span>{basicAppInfo.applyTime}</span>
                            </div>
                        </div> : <div>
                        申请时间：<span>{basicAppInfo.applyTime}</span>
                    </div>}
                    {(basicAppInfo.auditState === 2) && <Item {...buttonFromItemLayout}>
                        {
                            <Fragment>
                                <Button size="small" type="primary" onClick={submit}>
                                    通过
                                </Button>
                                <Button
                                    size="small"
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        this.setState({
                                            isViewModel: true,
                                        })
                                    }}
                                >
                                    驳回
                                </Button>
                            </Fragment>
                        }
                    </Item>}

                    {this.auditArr && this.auditArr.map((item, index) => {
                        return (
                            <Item {...shortItemLayout} label={item.label} key={index}>
                                {item.value}
                            </Item>
                        )
                    })}

                </Form>

                <Modal
                    className="help-top-remove-confirm"
                    title={'审批驳回意见'}
                    visible={isViewModel}
                    okType="danger"
                    onOk={submit}
                    onCancel={handleCancel}
                >
                    <RadioGroup onChange={onChange} value={value} style={{marginBottom: 30}}>
                        <Radio value={'营业执照和公司名称不符'}>营业执照和公司名称不符</Radio>
                        <Radio value={'未上传真实的营业执照'}>未上传真实的营业执照</Radio>
                        <Radio value={'其他'} className='radio-other'>其他</Radio>
                    </RadioGroup>
                    <TextArea minrows={5} disabled={textAreaStatus}/>
                </Modal>
            </div>
        )
    }

}
