import React, { useEffect, useState } from 'react'
import Home from '../../views/sendbox/home/Home'
import UserList from '../../views/sendbox/user-manage/UserList'
import RoleList from '../../views/sendbox/right-manage/RoleList'
import RightList from '../../views/sendbox/right-manage/RightList'
import NewsAdd from '../../views/sendbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sendbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sendbox/news-manage/NewsCategory'
import Audit from '../../views/sendbox/audit-manage/Audit'
import AuditList from '../../views/sendbox/audit-manage/AuditList'
import Unpublished from '../../views/sendbox/publish-manage/Unpublished'
import Published from '../../views/sendbox/publish-manage/Published'
import Sunset from '../../views/sendbox/publish-manage/Sunset'
import NoPermission from '../../views/sendbox/no-permission/NoPermission'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import NewsPreview from '../../views/sendbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sendbox/news-manage/NewsUpdate'
import { Spin } from 'antd'
import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}

function NewsRouter(props) {
    const { role } = JSON.parse(localStorage.getItem('token') || '')
    const [backRouterList, setBackRouterList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5000/rights'),
            axios.get('http://localhost:5000/children')
        ]).then(res => {
            setBackRouterList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRoute = (route) => {
        return LocalRouterMap[route.key] && (route.pagepermisson || route.routepermisson)
    }

    const checkPermission = (key) => {
        return role.rights.includes(key)
    }
    return (
        <Spin size='large' spinning={props.isLoading}>
            <Routes>
                {
                    backRouterList.map(route => {
                        if (checkRoute(route) && checkPermission(route.key)) {
                            return <Route path={route.key} key={route.key} element={LocalRouterMap[route.key]} />
                        }
                        return null
                    }

                    )
                }


                <Route path='*' element={<NoPermission />} />

            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ loadingReducer: { isLoading
} }) => {
    return {
        isLoading
    }
}

export default connect(mapStateToProps)(NewsRouter)
