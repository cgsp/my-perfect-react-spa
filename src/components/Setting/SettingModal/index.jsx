import React from 'react'
import {
  Button,
  Modal
} from 'antd'
import './style.scss'

class SettingModal extends React.Component {

  render() {
    return (
      <Modal
        className={`setting-modal cashModal`}
        title={this.props.title}
        visible={this.props.visible}
        okType="danger"
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        destroyOnClose
        width={640}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" onClick={this.props.handleOk}>确定</Button>,
        ]}
      >
        {this.props.content}
      </Modal>
    )
  }
}

export default SettingModal
