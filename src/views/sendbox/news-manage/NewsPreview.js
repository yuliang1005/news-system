import React, { useEffect, useState } from 'react'
import { Descriptions, Tag, Typography } from 'antd'
import { useMatch } from 'react-router-dom'
import axios from 'axios'
import { LeftOutlined } from '@ant-design/icons'
import Moment from 'react-moment'
const { Title, Text } = Typography

export default function NewsPreview() {
  const match = useMatch('/news-manage/preview/:id')
  const [dataSource, setDataSource] = useState(null)
  useEffect(() => {
    axios.get(`http://localhost:5000/news?id=${match.params.id}&_expand=category&_expand=role`).then(res => {
      setDataSource(res.data[0])
    })
  }, [])

  const auditList = [{
    value: '未审核',
    color: 'blue'
  },
  {
    value: '审核中',
    color: 'yellow'
  },
  {
    value: '已通过',
    color: 'green'
  },
  {
    value: '未通过',
    color: 'red'
  }]
  const publishList = [{
    value: '未发布',
    color: 'blue'
  },
  {
    value: '待发布',
    color: 'yellow'
  },
  {
    value: '已上线',
    color: 'green'
  },
  {
    value: '已下线',
    color: 'gray'
  }]
  return (
    <div>
      {dataSource && <div>
        <div style={{ marginBottom: '20px' }}>
          <LeftOutlined style={{ padding: '10px', marginRight: '10px' }} onClick={() => window.history.back()} />
          <Title level={2} style={{ display: 'inline', marginRight: '10px' }}>{dataSource.label}</Title>
          <Text type='secondary'>{dataSource.category.value}</Text>
        </div>
        <Descriptions>
          <Descriptions.Item label="创建者">{dataSource.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间"><Moment format='YYYY/MM/DD hh:mm:ss'>{dataSource.createTime
          }</Moment></Descriptions.Item>
          <Descriptions.Item label="发布时间">{
            dataSource.publishTime ?
              <Moment format='YYYY/MM/DD hh:mm:ss'>{dataSource.publishTime
              }
              </Moment>
              : '-'
          }
          </Descriptions.Item>
          <Descriptions.Item label="区域">{dataSource.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Tag color={auditList[dataSource.auditState].color}>{auditList[dataSource.auditState].value}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态"><Tag color={publishList[dataSource.publishState].color}>{publishList[dataSource.publishState].value}</Tag></Descriptions.Item>
          <Descriptions.Item label="访问数量">{dataSource.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{dataSource.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
        <div dangerouslySetInnerHTML={{
          __html: dataSource.content
        }}></div>
      </div>
      }
    </div >
  )
}
