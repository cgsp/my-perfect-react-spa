import React, { Component } from 'react'
import {
   Icon,
   Modal
} from 'antd'
import './style.scss'
export default class Image extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previewImage: '',
            previewVisible: false
        }
    }

    onPreview =(url)=>{
        this.setState({
            previewImage:url,
            previewVisible: true
        })
    }

    handleImgCancel = () => {
        this.setState({ previewVisible: false })
    }

    render(){
        let {picList} = this.props

        if(picList && typeof picList === 'string'){
            picList = picList.split(';')
        }

        const {previewVisible, previewImage} = this.state
        const {onPreview, handleImgCancel} = this
        return(
            <div className="enLargeImg">
                <div className="preview-screenshot-list">
                    {picList && picList.length > 0 && picList.map((picUrl, index) => (
                        <div className="preview-screenshot-item" key={index}>
                          <span>
                            <img className="screenshot-image" width="100%" height="100%" src={picUrl} alt="previewImage" />
                            <Icon type="eye-o" className="preview" onClick={() => onPreview(picUrl)} />
                          </span>
                        </div>
                    ))}
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={handleImgCancel}>
                    <img alt="previewImage" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>

        )
    }
}

