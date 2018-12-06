/**
 * Author：tantingting
 * Time：2017/9/20
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Icon, Row, Col, Button, Table, Select, message, Modal } from 'antd'
import './lanhuage.scss'
import WordEdit from './word.edit'
import WordImport from './word.import'
import WordImportError from './word.import.error'
import IconItem from '../../components/icon/icon'
import {getLanguage, getWordsList, addLanguageQuery, addLanguageData, delWordItem} from '../../actions/useless/language.action'
import {axiosPost} from '../../public/index'
const Option = Select.Option
const confirm = Modal.confirm
let columns = []
class LanguageIndex extends Component {
    constructor () {
        super()

        this.state = {
            'lang': 'zh',
            'code': '',
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0,
            'editModalShow': false,
            'editModalType': 'add',
            'importModalShow': false,
            'importErrorModalShow': false
        }
    }
    componentWillMount () {
        const {dispatch} = this.props
        dispatch(addLanguageQuery({'lang': this.state.lang}))
        this.doSearch({})
        columns = [{
            title: '词条key ',
            dataIndex: 'i18nKey',
            key: 'code'
        }, {
            title: '词条译文 ',
            dataIndex: 'i18nValue',
            key: 'val'
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <a className="mr10" onClick={() => this.editWord(item)} href="javascript:void(0)">修改</a>
                <a className="mr10" onClick={() => this.delWord(item)} href="javascript:void(0)">删除</a>
            </div>)
        }]
    }
    componentDidMount () {
        const {dispatch} = this.props
        dispatch(getLanguage({}))
    }
    // 改变语言包
    changeLang (val) {
        const {dispatch} = this.props
        this.setState({'lang': val})
        dispatch(addLanguageQuery({'lang': val}))
        this.doSearch({'i18nLang': val})
    }

    // 搜索
    doSearch (data) {
        const {dispatch} = this.props
        let sendData = {
            'i18nLang': this.state.lang,
            'i18nKey': this.state.code,
            'page': this.state.currPage,
            ...data
        }
        dispatch(getWordsList(sendData, (resData) => {
            this.setState({'totalCount': resData.totalCount, 'pageSize': resData.pageSize})
        }))
    }

    // 分页
    changePage (page) {
        this.setState({'currPage': page})
        this.doSearch({'page': page})
    }

    editWord (item) {
        const {dispatch} = this.props
        this.setState({'editModalShow': true, 'editModalType': 'edit'})
        dispatch(addLanguageQuery({'lang': this.state.lang, 'code': item.i18nKey, 'val': item.i18nValue}))
        // dispatch(getListById({'id': item.id}))
    }

    delWord (item) {
        const {dispatch} = this.props
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                dispatch(delWordItem({'i18nKey': item.i18nKey, 'i18nLang': item.i18nLang}, item.key))
            }
        })
    }

    submitEdit (sendData) {
        const {editModalType} = this.state
        const {dispatch} = this.props
        let _url = `/i18n/${editModalType === 'edit' ? 'update' : 'add'}`
        // let _sendData = editModalType ===  'edit' ? {...sendData, id: query.id} : sendData
        let _sendData = sendData
        axiosPost(_url, _sendData, (res) => {
            if (res.status === 200) {
                message.success('操作成功！')
                this.setState({'editModalShow': false})
                dispatch(addLanguageData({'query': {}}))
                this.doSearch({})
            } else {
                message.error(res.message)
            }
        })
    }

    submitImport (res) {
        if (res.status === 200) {
            message.success('文件上传成功')
            this.setState({'importModalShow': false})
            this.doSearch({})
        } else {
            message.error('文件上传失败')
        }
    }
    // 模板下载
    exportData () {
        let url = '/i18n/exportexcel'
        let _url = `/club${url}`
        window.location = _url
    }
    render () {
        // console.log(this.state)
        const {language, list, query, dispatch} = this.props
        let langArr = Object.entries(language)
        return <div className="postUser-index">
            <Row>
                <Col span={3}>
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        value={this.state.lang}
                        onChange={(val) => this.changeLang(val)}
                    >
                        {
                            !langArr.length ? '' : langArr.map((item, index) => (<Option key={index} value={item[0]}>{item[1]}</Option>))
                        }
                    </Select>
                </Col>
                <Col offset={1} span={5}>
                    <Input
                        value={this.state.code}
                        onChange={(e) => this.setState({'code': e.target.value})}
                        placeholder="请输入词条key"
                        prefix={<Icon type="search" />}
                    />
                </Col>
                <Col offset={1} span={3}>
                    <Button className="mr10" type="primary" onClick={() => this.doSearch({'page': 1})}><IconItem type="icon-search"/>搜索</Button>
                    <Button onClick={() => this.setState({'code': ''})}><IconItem type="icon-clear"/>清除</Button>
                </Col>
                <Col span={11} className="text-right">
                    <Button className="mr10" type="primary" onClick={() => { this.setState({'editModalShow': true, 'editModalType': 'add'}); dispatch(addLanguageQuery({'lang': this.state.lang})) }}><Icon type="plus" />单条添加</Button>
                    <Button className="mr10" type="primary" onClick={() => this.exportData()}><IconItem type="icon-download"/>模板下载</Button>
                    <Button type="primary" onClick={() => this.setState({'importModalShow': true})}><IconItem type="icon-upload"/>批量导入</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: this.state.currPage, total: this.state.totalCount, pageSize: this.state.pageSize, onChange: (page) => this.changePage(page)}} />
            </div>
            {/* 单条词条添加，修改 */}
            <WordEdit langs = {language} query={query} isShow={this.state.editModalShow} type={this.state.editModalType} submitEdit={(data) => this.submitEdit(data)} onClose={() => { this.setState({'editModalShow': false}); dispatch(addLanguageData({'query': {}})) }} />
            {/* 批量导入 */}
            <WordImport isShow={this.state.importModalShow} submitFile={(res) => this.submitImport(res)} onClose={() => this.setState({'importModalShow': false})} />
            {/* 导入失败 */}
            <WordImportError isShow={this.state.importErrorModalShow} onClose={() => this.setState({'importErrorModalShow': false})} />
        </div>
    }
}

const mapStateToProps = (state) => {
    // console.log(state)
    return {
        languageInfo: state.languageInfo,
        language: state.languageInfo.language,
        list: state.languageInfo.list,
        query: state.languageInfo.query
    }
}

export default connect(mapStateToProps)(LanguageIndex)
