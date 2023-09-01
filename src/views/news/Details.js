import React, { useEffect, useState } from 'react'
import { Descriptions, Tag, Typography } from 'antd'
import { useMatch } from 'react-router-dom'
import axios from 'axios'
import { LeftOutlined } from '@ant-design/icons'
import Moment from 'react-moment'
import { HeartTwoTone } from '@ant-design/icons';
const { Title, Text } = Typography

export default function Details() {
    const match = useMatch('/news/details/:id')
    const [dataSource, setDataSource] = useState(null)

    const handleStar = () => {
        setDataSource({
            ...dataSource,
            star: dataSource.star + 1
        })
        axios.patch(`http://localhost:5000/news/${match.params.id}`, {
            star: dataSource.star + 1
        })
    }
    useEffect(() => {
        axios.get(`http://localhost:5000/news/${match.params.id}?_expand=category&_expand=role`).then(res => {
            setDataSource({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`http://localhost:5000/news/${match.params.id}`, {
                view: res.view + 1
            })
        })

    }, [])

    return (
        <div style={{ width: '95vw', margin: '0 auto' }}>
            {dataSource && <div>
                <div style={{ marginBottom: '20px' }}>
                    <LeftOutlined style={{ padding: '10px', marginRight: '10px' }} onClick={() => window.history.back()} />
                    <Title level={2} style={{ display: 'inline', marginRight: '10px' }}>{dataSource.label}</Title>
                    <Text type='secondary'>{dataSource.category.value}</Text>
                    <span> </span>
                    <HeartTwoTone onClick={() => handleStar()} />
                </div>
                <Descriptions>
                    <Descriptions.Item label="创建者">{dataSource.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{
                        dataSource.publishTime ?
                            <Moment format='YYYY/MM/DD hh:mm:ss'>{dataSource.publishTime
                            }
                            </Moment>
                            : '-'
                    }
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{dataSource.region}</Descriptions.Item>
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
