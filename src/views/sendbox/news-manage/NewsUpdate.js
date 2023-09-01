import React, { useEffect, useRef, useState } from 'react'
import { Button, Steps, Form, Input, Select, message, notification, Typography } from 'antd'
import axios from 'axios'
import style from './News.module.css'
import NewsEditor from '../../../components/news-manager/NewsEditor'
import { useNavigate, useMatch } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
const { Option } = Select
const { Title } = Typography

export default function NewsUpdate() {
    const match = useMatch('/news-manage/update/:id')
    const [NewsCurrent, setNewsCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState('')
    const newsForm = useRef()
    const [api, contextHolder] = notification.useNotification()
    const navigate = useNavigate()
    const items = [
        {
            title: '基本信息',
            description: '新闻标题，新闻分类'
        },
        {
            title: '新闻内容',
            description: '新闻主体内容'
        },
        {
            title: '新闻提交',
            description: '保存草稿或提交审核'
        },
    ]

    const NewsNext = () => {
        if (NewsCurrent === 0) {
            newsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setNewsCurrent(NewsCurrent + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('请输入新闻内容！')
            } else {
                setNewsCurrent(NewsCurrent + 1)
            }
        }
    }
    const NewsPrevious = () => {
        setNewsCurrent(NewsCurrent - 1)
    }

    const handleSave = (auditState) => {
        axios.patch(`http://localhost:5000/news/${match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            if (res.data.auditState === 0) {
                notification.info({
                    message: '保存成功！',
                    description:
                        '请前往草稿箱查看稿件',
                    placement: 'bottomRight'
                })
                navigate('/news-manage/draft')
            } else {
                notification.warning({
                    message: '提交审核成功！',
                    description:
                        '请等待新闻审核结果',
                    placement: 'bottomRight'
                })
                navigate('/audit-manage/list')
            }
        })
    }

    useEffect(() => {
        axios.get('http://localhost:5000/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?id=${match.params.id}&_expand=category&_expand=role`).then(res => {
            console.log(res.data[0])
            let { label, categoryId, content } = res.data[0]
            newsForm.current.setFieldsValue({
                label,
                categoryId
            })
            setContent(content)
        })
    }, [])

    return (
        <div>
            {contextHolder}
            <div style={{ marginBottom: '20px' }}>
                <LeftOutlined style={{ padding: '10px', marginRight: '10px' }} onClick={() => window.history.back()} />
                <Title level={2} style={{ display: 'inline', marginRight: '10px' }}>更新新闻</Title>
            </div>
            <Steps
                current={NewsCurrent}
                items={items}
            />
            <div style={{ marginTop: '50px' }}>
                <Form
                    name="newsAdd"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    ref={newsForm}
                >
                    <div className={NewsCurrent === 0 ? '' : style.active}>
                        <Form.Item
                            label="新闻标题"
                            name="label"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新闻标题！',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择新闻分类！',
                                },
                            ]}
                        >
                            <Select>
                                {categoryList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.value}</Option>
                                )}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={NewsCurrent === 1 ? '' : style.active}>
                        <NewsEditor getContent={(value) => {
                            setContent(value)
                        }} content={content}></NewsEditor>
                    </div>
                    <div className={NewsCurrent === 2 ? '' : style.active}>

                    </div>
                </Form>
            </div>
            <div style={{ marginTop: '50px' }}>
                {NewsCurrent < items.length - 1 ? <Button type='primary' onClick={NewsNext}>下一步</Button>
                    :
                    <span>
                        <Button type='primary' onClick={() => { handleSave(0) }}>保存草稿箱</Button>
                        <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
                    </span>
                }
                {NewsCurrent > 0 && <Button type='primary' ghost onClick={NewsPrevious}>上一步</Button>}
            </div>
        </div>
    )
}
