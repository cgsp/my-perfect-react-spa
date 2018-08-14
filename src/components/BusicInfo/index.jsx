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
    'personDevelop':{
        2: {
            title: '个人开发者审批',
            statusText: '',
        },
        3: {
            title: '个人开发者详情',
            statusText: '审核已通过',


        },
        4: {
            title: '个人开发者详情',
            statusText: '审核未通过',

        }
    },
    'companyDevelop':{
        2: {
            title: '企业开发者审批',
            statusText: '',
        },
        3: {
            title: '企业开发者详情',
            statusText: '审核已通过',


        },
        4: {
            title: '企业开发者详情',
            statusText: '审核未通过',

        }
    },
    'HM':{
        2: {
            title: '移动应用上线审批',
            statusText: '',
        },
        3: {
            title: '移动应用上线审批详情',
            statusText: '审核已通过',


        },
        4: {
            title: '移动应用上线审批详情',
            statusText: '审核未通过',

        }
    },
    'HW':{
        2: {
            title: '网站应用审批',
            statusText: '',
        },
        3: {
            title: '网站应用审批详情',
            statusText: '审核已通过',


        },
        4: {
            title: '网站应用审批详情',
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
            case 'personDevelop':
                this.auditArr = [
                    {label: '姓名', value: basicAppInfo.developerName},
                    {label: '身份证号', value: basicAppInfo.idCardNo},
                    {label: '身份证照', value: <img src={basicAppInfo.idCardPhoto} width="68" height="68"/>},
                    {label: '手机号码', value: basicAppInfo.companyAddress},
                    {label: '邮箱', value: <img src={basicAppInfo.companyBusinessLicense} width="68" height="68"/>},
                    {label: '联系地址', value: basicAppInfo.developerPhone},
                    {label: '开发者简介', value: basicAppInfo.developerIntro},
                ]
                break
            case 'companyDevelop':
                this.auditArr = [
                    {label: '公司名称', value: basicAppInfo.companyName},
                    {label: '公司主页网址', value: basicAppInfo.companySite},
                    {label: '公司介绍', value: basicAppInfo.companyDesc},
                    {label: '公司地址', value: basicAppInfo.companyAddress},
                    {label: '企业工商营业执照', value: <img src={basicAppInfo.companyBusinessLicense} width="68" height="68"/>},
                    {label: '公司联系人姓名', value: basicAppInfo.developerName},
                    {label: '联系人手机号', value: basicAppInfo.developerPhone},
                    {label: '联系人邮箱', value: basicAppInfo.developerEmail},
                ]
                break
            case 'HM':
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
            case 'HW':
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
                        <div className="basic-title">{arr[mark][basicAppInfo.auditState].title}</div>
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

                        {this.auditArr && this.auditArr.map((item, index) => {
                            return (
                                <Item {...shortItemLayout} label={item.label} key={index}>
                                    {item.value}
                                </Item>
                            )
                        })}
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
