import React from 'react'
import {
  Button,
  Modal
} from 'antd'
import './style.scss'

class AuditModal extends React.Component {

  render() {
    const { handleOk, handleCancel, passButton, isPassModal } = this.props
    return (
      <Modal
        className="help-top-remove-confirm"
        title={'审批通过'}
        visible={isPassModal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleOk} disabled={passButton}>确定</Button>,
        ]}
      >
        您确定审批通过此单据吗？
      </Modal>
    )

  }
}

export default AuditModal
