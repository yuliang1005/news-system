import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
const { confirm } = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '权限名称',
      dataIndex: 'label'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{ textAlign: 'center' }}><Switch checked={item.pagepermisson === 1} onChange={() => { switchMethod(item) }} /></div>}
            title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'hover'}>
            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === undefined || item.id === 7}></Button>
          </Popover>
          <span> </span>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }}></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      let list = res.data
      for (let i of list) {
        if (i.children.length === 0) {
          delete i.children
        }
      }
      setDataSource(list)
    })
  }, [])

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  const showConfirm = (item) => {
    confirm({
      title: '确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      onOk() {
        console.log(item)
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      // axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource])
      // axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={
          {
            pageSize: 5
          }
        } />;
    </div>
  )
}
