import Title from 'antd/es/typography/Title'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/UsePublish'
import { Button } from 'antd'

export default function Sunset() {
  const { dataSource, handleDelete, handleRePublish } = usePublish(3)

  return (
    <div>
      <Title level={3}>已下线</Title>
      <NewsPublish dataSource={dataSource} button={(id) => <span>
        <Button type='primary' onClick={()=>{
          handleRePublish(id)
        }}>上线</Button>
        <Button danger onClick={() => {
          handleDelete(id)
        }}>删除</Button>
      </span>}></NewsPublish>
    </div>
  )
}
