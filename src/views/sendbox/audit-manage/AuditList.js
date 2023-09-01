import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, notification, Table, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import Title from 'antd/es/typography/Title'

export default function AuditList() {
  const navigate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token') || '')
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        if (auditState === 1) {
          return <Tag color='orange'>审核中</Tag>
        } else if (auditState === 2) {
          return <Tag color='green'>已通过</Tag>
        } else {
          return <Tag color='red'>未通过</Tag>
        }
      }
    },
    {
      title: '操作',
      render: (item) => {
        if (item.auditState === 1) {
          return <Button danger onClick={() => { handleRevert(item.id) }}>撤销</Button>
        } else if (item.auditState === 2) {
          return <Button type='primary' onClick={() => {
            handlePublish(item.id)
          }}>发布</Button>
        } else {
          return <Button onClick={() => {
            navigate(`/news-manage/update/${item.id}`)
          }}>更新</Button>
        }
      }
    },
  ]

  const handlePublish = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://localhost:5000/news/${id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(() => {
      notification.success({
        message: '发布成功！',
        description:
          '请前往已发布列表中查看稿件',
        placement: 'bottomRight'
      })
      navigate('/publish-manage/published')
    })
  }

  const handleRevert = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://localhost:5000/news/${id}`, {
      auditState: 0
    }).then(() => {
      notification.info({
        message: '撤回成功！',
        description:
          '请前往草稿箱中查看撤回稿件',
        placement: 'bottomRight'
      })
    })
  }
  useEffect(() => {
    axios.get(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  return (
    <div>
      <Title level={3}>审核列表</Title>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
    </div>
  )
}
