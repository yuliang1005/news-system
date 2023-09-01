import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import { Layout, theme } from 'antd'
import './NewsSendBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
const { Content } = Layout;

export default function NewsSendBox() {
  nProgress.start()
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  useEffect(() => {
    nProgress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>

      </Layout>

    </Layout>
  )
}
