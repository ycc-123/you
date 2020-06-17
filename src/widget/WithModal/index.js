/**
 * file modal封装📦
 */
import React, { Component } from 'react'
import { Modal } from 'antd'

class WithModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      title: '',
      ModalContent: null,
      onOK: () => {
        this.setState({ visible: false })
      },
      onCancel: () => this.setState({ visible: false }),
      width: 378,
    };
  }

  show = ({ title, width = 378, content, onOK = () => this.setState({ visible: false }), onCancel = () => this.setState({ visible: false }) }) => {
    this.setState({
      visible: true,
      ModalContent: content,
      title,
      width,
      onOK,
      onCancel,
    })
    // return一个promise对象
    return new Promise(resolve => {
      resolve()
    })
  }

  colse = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { ModalContent, onCancel, title, visible, width, onOK } = this.state
    return (
      <Modal
        title={title}
        visible={visible}
        width={width || 'initial'}
        onCancel={onCancel}
        onOk={onOK}
        {...this.props}
      >
        {
          ModalContent ? (
            <ModalContent />
          ) : null
        }
      </Modal>
    )
  }
}

export default WithModal
