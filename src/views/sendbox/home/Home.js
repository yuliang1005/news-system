import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card

export default function Home() {
  const navigate = useNavigate()
  const barRef = useRef()
  const pieRef = useRef()
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token') || '')
  const [dataSource, setDataSouce] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const showDrawer = () => {
    setOpen(true);
  }
  const onClose = () => {
    setOpen(false);
  }
  useEffect(() => {
    axios.get('http://localhost:5000/news').then(res => {
      setDataSouce(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.label))
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (list) => {
    var myChart = echarts.init(barRef.current)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(list),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      legend: {
        data: ['数量']
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(list).map(item => item.length)
        }
      ]
    })

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = () => {
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.label)
    console.log(groupObj)
    var list = []
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    console.log(list)
    var myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: `${username}所发布的新闻分类图示`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    option && myChart.setOption(option)
  }
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={false}>
            <List
              size="small"
              bordered
              dataSource={dataSource.sort(function (a, b) { return b.view - a.view }).slice(0, 10)}
              renderItem={(item) => <List.Item><a onClick={() => navigate(`/news-manage/preview/${item.id}`)}>{item.label}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={false}>
            <List
              size="small"
              bordered
              dataSource={dataSource.sort(function (a, b) { return b.star - a.star }).slice(0, 10)}
              renderItem={(item) => <List.Item><a onClick={() => navigate(`/news-manage/preview/${item.id}`)}>{item.label}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                showDrawer()
                setTimeout(() => {
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={<div>
                <b>{region === "" ? '全球' : region}</b>
                <span>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>
      <Drawer title="个人新闻分类" placement="right" onClose={onClose} open={open} width='500px'>
        <div ref={pieRef} style={{
          height: '400px',
          marginTop: '30px'
        }}></div>
      </Drawer>
      <div ref={barRef} style={{
        height: '400px',
        marginTop: '30px'
      }}></div>
    </div>
  )
}
