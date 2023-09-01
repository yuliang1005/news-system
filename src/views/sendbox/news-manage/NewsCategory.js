import Title from 'antd/es/typography/Title'
import { Button, Table, notification, Form, Input } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
}

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])

  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '栏目名称',
      dataIndex: 'label',
      editable: true
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button shape='circle' danger icon={<DeleteOutlined />} onClick={() => {
            handleDelete(item.id)
          }}></Button>
        </div>
      }
    },
  ]

  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    // axios.delete(`http://localhost:5000/categories/${id}`).then(() => {
    //   notification.success({
    //     message: '该分类移除成功！',
    //     description:
    //       '请查看新闻分类列表！',
    //     placement: 'bottomRight'
    //   })
    // })
  }

  const handleSave = (row) => {
    setDataSource(dataSource.map(item => {
      if (item.id === row.id) {
        return {
          id: item.id,
          label: row.label,
          value: row.label
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/categories/${row.id}`, {
      label: row.label,
      value: row.label
    })
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/categories`).then(res => {
      setDataSource(res.data)
    })
  }, [])
  return (
    <div>
      <Title level={3}>新闻分类</Title>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} components={components}></Table>
    </div>
  )
}
