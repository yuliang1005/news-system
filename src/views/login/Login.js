import React, { useCallback } from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Particles from 'react-particles'
import { loadFull } from "tsparticles"
import { particlesOption } from './particlesSet'
import './Login.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, [])
  const onFinish = (values) => {
    console.log('Success:', values)

    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length === 0) {
        message.error('用户名与密码不匹配')
      } else {
        localStorage.removeItem('token')
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        message.success('登录成功')
        navigate('/home')
      }
    })
  };
  return (
    <div style={{ height: '100vh' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOption}
      />
      <div className='formContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: 'white' }}>Remember me</Checkbox>
            </Form.Item>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
