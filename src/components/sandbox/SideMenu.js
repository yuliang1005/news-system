import React, { useEffect, useState } from 'react'
import {
  HomeOutlined,
  UserOutlined,
  KeyOutlined,
  ContainerOutlined,
  ExceptionOutlined,
  MailOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
const { Sider } = Layout;

const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <KeyOutlined />,
  '/news-manage': <ContainerOutlined />,
  '/audit-manage': <ExceptionOutlined />,
  '/publish-manage': <MailOutlined />
}

function SideMenu(props) {
  const { role } = JSON.parse(localStorage.getItem('token') || '')
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      let list = res.data.filter(item => item.pagepermisson === 1 && role.rights.includes(item.key))
      for (const i of list) {
        i.icon = iconList[i.key]
        if (i.children.length > 0) {
          i.children = i.children.filter(item => item.pagepermisson === 1 && role.rights.includes(item.key))
        } else {
          delete i.children
        }
      }
      setMenu(list)
    })
  }, [])
  const nevigate = useNavigate()
  const selectKeys = useLocation()
  const openKeys = ['/' + selectKeys.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollpased}>
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={openKeys}
            defaultOpenKeys={openKeys}
            items={menu}
            ico
            onClick={(e) => {
              nevigate(e.key)
            }}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ collpaseReducer: { isCollpased
} }) => {
  return {
    isCollpased
  }
}

export default connect(mapStateToProps)(SideMenu)
