import { notification } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
export default function usePublish(state) {
    const { username } = JSON.parse(localStorage.getItem('token') || '')
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&publishState=${state}&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username, state])

    const handlePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(() => {
            notification.success({
                message: '发布成功！',
                description:
                    '请前往发布列表查看稿件',
                placement: 'bottomRight'
            })
        })
    }

    const handleSunset = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 3
        }).then(() => {
            notification.info({
                message: '稿件已下线！',
                description:
                    '请前往下线列表查看稿件',
                placement: 'bottomRight'
            })
        })
    }

    const handleRePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 2
        }).then(() => {
            notification.success({
                message: '稿件已重新上线！',
                description:
                    '请前往已发布列表查看稿件',
                placement: 'bottomRight'
            })
        })
    }
    const handleDelete = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`http://localhost:5000/news/${id}`).then(() => {
            notification.success({
                message: '删除成功！',
                description:
                    '该稿件已删除',
                placement: 'bottomRight'
            })
        })
    }
    return { dataSource, handlePublish, handleDelete, handleSunset, handleRePublish }
}