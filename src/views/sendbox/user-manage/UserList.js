import { Table, Switch, Button, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { CollectionCreateForm } from '../../../components/user-manage/UserForm'
const { confirm } = Modal

export default function UserList() {
  const { roleId, username, region } = JSON.parse(localStorage.getItem('token') || '')
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} />
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => {
            setIsUpdateVisible(true)
            setSelectedUser(item)
          }}></Button>
          <span> </span>
          <Button danger shape='circle' icon={<DeleteOutlined />} disabled={item.default} onClick={() => {
            showConfirm(item)
          }}></Button>
        </div>
      }
    }
  ]
  const [dataSource, setDataSource] = useState([])
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({})
  const onCreate = (values) => {
    setIsAddVisible(false)
    axios.post('http://localhost:5000/users', {
      ...values,
      "roleState": true,
      "default": false
    }).then(res => {
      setDataSource([...dataSource, {
        ...res.data,
        role: roleList.filter(item => item.id === values.roleId)[0]
      }])
    })
  }

  const onUpdate = (values, id) => {
    setIsUpdateVisible(false)

    setDataSource(dataSource.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...values,
          role: roleList.filter(data => data.id === values.roleId)[0]
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/users/${id}`, {
      ...values
    })

    setSelectedUser({})
  }

  const handleChange = (item) => {
    console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])

    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const showConfirm = (item) => {
    confirm({
      title: '确定要删除吗？',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }


  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(roleId === 1 ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && item.roleId > roleId)
      ])
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/regions').then(res => {
      setRegionList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setRoleList(res.data)
    })
  }, [])

  return (
    <div>
      <Button type='primary' onClick={() => {
        setIsAddVisible(true)
      }}>添加用户</Button>
      <CollectionCreateForm
        open={isAddVisible}
        onCreate={onCreate}
        regionList={regionList}
        roleList={roleList}
        title='添加用户'
        okText='添加'
        onCancel={() => {
          setIsAddVisible(false)
        }}
      />

      <CollectionCreateForm
        open={isUpdateVisible}
        onCreate={onUpdate}
        regionList={regionList}
        roleList={roleList}
        selectedUser={selectedUser}
        title='更新用户'
        okText='更新'
        onCancel={() => {
          setIsUpdateVisible(false)
          setSelectedUser({})
        }}
      />


      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
