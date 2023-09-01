import React from 'react'
import { Button, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function NewsPublish(props) {
    const navigate = useNavigate()
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'label',
            render: (text, item) =>
                <a onClick={() => {
                    navigate(`/news-manage/preview/${item.id}`)
                }}>{text}</a>

        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return category.value
            }
        },
        {
            title: '操作',
            render:(item)=>{
                return props.button(item.id)
            }
        }
    ]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
        </div>
    )
}
