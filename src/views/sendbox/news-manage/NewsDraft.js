import { Table, Button, Modal, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
const { confirm } = Modal

export default function NewsDraft() {
  const navigate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token') || '')
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
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
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.value
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
            navigate(`/news-manage/update/${item.id}`)
          }}></Button>
          <span> </span>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => {
            showConfirm(item)
          }}></Button>
          <span> </span>
          <Button type='primary' shape='circle' icon={<UploadOutlined />} onClick={() => {
            onAudit(item.id)
          }}></Button>
        </div>
      }
    },
  ]

  const onAudit = (id) => {
    axios.patch(`http://localhost:5000/news/${id}`, {
      auditState: 1
    }).then(() => {
      navigate('/audit-manage/list')
      notification.warning({
        message: '提交审核成功！',
        description:
          '请前往审核列表查看稿件',
        placement: 'bottomRight'
      })
    })
  }

  const showConfirm = (item) => {
    confirm({
      title: '确定要删除吗？',
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/news/${item.id}`)

  }


  useEffect(() => {
    axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expand=category`).then(res => {
      let list = res.data
      // console.log(list)
      setDataSource(list)
    })
  }, [username])

  return (
    <div>
      <Title level={3}>草稿箱</Title>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
    </div>
  )
}
