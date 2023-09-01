import Title from 'antd/es/typography/Title'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/UsePublish'
import { Button } from 'antd'

export default function Published() {
  const { dataSource, handleSunset } = usePublish(2)
  return (
    <div>
      <Title level={3}>已发布</Title>
      <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={()=>
        handleSunset(id)
      }>下线</Button>}></NewsPublish>
    </div>
  )
}
