import { Button } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/UsePublish'

export default function Unpublished() {

  const { dataSource, handlePublish } = usePublish(1)
  return (
    <div>
      <Title level={3}>待发布</Title>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => {
        handlePublish(id)
      }}>发布</Button>}></NewsPublish>
    </div>
  )
}
