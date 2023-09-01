import Title from 'antd/es/typography/Title'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List } from 'antd'
import _ from 'lodash'
import './News.scss'
import { useNavigate } from 'react-router-dom'

export default function News() {
    const navigate = useNavigate()
    const [newsList, setNewsList] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(res => {
            const list = _.groupBy(res.data, item => item.category.label)
            setNewsList(Object.entries(list))
        })
    }, [])
    return (
        <div style={{ width: '95vw', margin: '0 auto' }}>
            <Title level={3}>全球新闻</Title>
            <Row>
                {newsList.map(item =>
                    <Col span={8} style={{ marginTop: '20px',height:'300px' }} key={item[0]}>
                        <Card title={item[0]} bordered={false} hoverable style={{width:'95%',margin: '0 auto',height:'100%'}}>
                            <List
                                size="small"
                                dataSource={item[1]}
                                renderItem={(data) => <List.Item><a onClick={()=>navigate(`/news/details/${data.id}`)}>{data.label}</a></List.Item>}
                                pagination={{
                                    pageSize: 3
                                }}
                            />
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    )
}
