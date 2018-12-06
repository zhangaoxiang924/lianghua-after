/**
 * Author：tantingting
 * Time：2017/9/22
 * Description：Description
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Modal, Tabs } from 'antd'
import WordImportSuccess from './word.import.success'
import WordImportRepeat from './word.import.repeat'
import './lanhuage.scss'
const TabPane = Tabs.TabPane
class WordImportError extends Component {
    submitForm = () => {
        const {form, submitEdit} = this.props
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            submitEdit()
            // form.resetFields()
        })
    }

    render () {
        const {isShow, onClose} = this.props
        return <div className="error-modal">
            <Modal title='批量导入' width={800} visible={isShow} onOk={() => this.submitForm()} onCancel={() => onClose()} okText="确认" cancelText="取消">
                <div className="detail-container">
                    <p className="tip-text"><span className="color-red">m+n</span>条<span className="color-red">简体中文</span>词条导入完毕，成功<span className="color-red">m</span>条，(与已有词条key重复)失败<span className="color-red">n</span>条！（直接点击确定将放弃编辑失败词条）</p>
                    <Tabs>
                        <TabPane tab="成功" key="1"><WordImportSuccess /></TabPane>
                        <TabPane tab="重复" key="2"><WordImportRepeat /></TabPane>
                    </Tabs>
                </div>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

export default connect(mapStateToProps)(WordImportError)
