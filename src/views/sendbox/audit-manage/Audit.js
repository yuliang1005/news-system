import Title from 'antd/es/typography/Title'
import { Button, Table, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function Audit() {
  const navigate = useNavigate()
  const { roleId, username, region } = JSON.parse(localStorage.getItem('token') || '')
  const [dataSource, setDataSource] = useState([])

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
      render: (item) => {
        return <div>
          <Button type='primary' shape='circle' icon={<CheckOutlined />} onClick={() => {
            handleChecked(item.id)
          }}></Button>
          <span> </span>
          <Button shape='circle' danger icon={<CloseOutlined />} onClick={() => {
            handleClose(item.id)
          }}></Button>
        </div>
      }
    },
  ]

  const handleClose = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://localhost:5000/news/${id}`, {
      auditState: 3
    }).then(() => {
      notification.info({
        message: '审核未通过！',
        description:
          '已退回用户审核列表',
        placement: 'bottomRight'
      })
    })
  }

  const handleChecked = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://localhost:5000/news/${id}`, {
      auditState: 2,
      publishState: 1
    }).then(() => {
      notification.success({
        message: '审核成功！',
        description:
          '用户可发布该新闻',
        placement: 'bottomRight'
      })
    })
  }

  useEffect(() => {
    axios.get(`http://localhost:5000/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      console.log(list)
      setDataSource(roleId === 1 ? list : [
        ...list.filter(item => item.region === region && item.roleId > roleId)
      ])
    })
  }, [roleId, username, region])
  return (
    <div>
      <Title level={3}>审核新闻</Title>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
    </div>
  )
}
