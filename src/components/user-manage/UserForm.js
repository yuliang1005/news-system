import { Form, Modal, Input, Select } from 'antd'
import { useEffect, useState } from 'react';
const { Option } = Select

export const CollectionCreateForm = ({ open, onCreate, onCancel, regionList, roleList, title, okText, selectedUser = {} }) => {
    const { roleId, region } = JSON.parse(localStorage.getItem('token') || '')
    const [form] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState(false)

    form.setFieldsValue(selectedUser)

    return (
        <Modal
            open={open}
            title={title}
            okText={okText}
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        if (selectedUser !== {}) {
                            onCreate(values, selectedUser.id)
                        } else {
                            onCreate(values)
                        }
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                >
                    <Input type='password' />
                </Form.Item>

                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled ? [] : [
                        {
                            required: true,
                            message: '请选择区域！',
                        },
                    ]}
                >
                    <Select>
                        {regionList.map(item =>
                            <Option value={item.value} key={item.id} disabled={roleId !== 1 && item.value !== region}>{item.label}</Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[
                        {
                            required: true,
                            message: '请选择角色！',
                        },
                    ]}
                >
                    <Select onChange={(value) => {
                        if (value === 1) {
                            setIsDisabled(true)
                            form.setFieldsValue({
                                region: ''
                            })
                        } else {
                            setIsDisabled(false)
                        }
                    }}>
                        {roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={roleId !== 1 && item.id !== 3}>{item.roleName}</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}