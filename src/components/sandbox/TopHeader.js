import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, theme, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header } = Layout;


function TopHeader(props) {
  const { role, username } = JSON.parse(localStorage.getItem('token') || '')
  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [
    {
      key: '1',
      label: (<div>{role.roleName}</div>),
    },
    {
      key: '2',
      danger: true,
      label: (<div onClick={() => {
        localStorage.removeItem('token')
        navigate('/login')
      }}>退出</div>),
    },
  ]

  const changeCollpased = () => {
    props.changeCollpased()
  }

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      {React.createElement(props.isCollpased ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => changeCollpased(),
      })}
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来！</span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({ collpaseReducer: { isCollpased
} }) => {
  return {
    isCollpased
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeCollpased: () => dispatch({ type: 'change_collpased' })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
