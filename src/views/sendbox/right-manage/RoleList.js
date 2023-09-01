import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape='circle' icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalOpen(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
          }}></Button>
          <span> </span>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => showConfirm(item)}></Button>
        </div>
      }
    },
  ]

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
    // axios.delete(`http://localhost:5000/roles/${item.id}`)

  }

  const handleOk = () => {
    console.log(currentRights)
    setIsModalOpen(false)
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      let list = res.data
      // console.log(list)
      setRightList(transformKey(list))
    })
  }, [])

  const transformKey = (list) => {
    for (let i of list) {
      i.title = i.label
      delete i.label
      if (i.children && i.children.length > 0) {
        transformKey(i.children)
      }
    }
    return list
  }

  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
