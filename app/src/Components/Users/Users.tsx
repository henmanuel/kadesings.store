import React from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Input, Table, Button, Switch, Typography, theme, Flex, Grid } from 'antd';

const {Content} = Layout;
const { useToken } = theme;

const { Title } = Typography;
const { useBreakpoint } = Grid;

export function Users(): React.ReactElement {
    const { token } = useToken();
    const screens = useBreakpoint();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
        },
        {
            title: 'Último Acceso',
            dataIndex: 'ultimoAcceso',
            key: 'ultimoAcceso',
        },
        {
            title: 'Acción',
            key: 'accion',
            render: () => (
                <Flex align="center" gap={token.marginXS}>
                    <Typography.Link>Editar</Typography.Link>
                    <Switch size="small" />
                </Flex>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            id: 'ID-4892',
            nombre: 'María Gómez',
            correo: 'maria.gomez@almo.com',
            ultimoAcceso: 'Hace 9 minutos',
        },
        // Add more data objects for other rows
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <Flex vertical gap={token.marginMD}>
                        <Title level={3}>Control de usuarios</Title>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={token.marginSM}>
                            <Input
                                placeholder="Buscar usuarios"
                                prefix={<SearchOutlined />}
                                style={{ width: screens.sm ? 300 : '100%' }}
                            />
                            <Button type="primary" icon={<PlusOutlined />} size="large" shape="circle" />
                        </Flex>
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                total: 50,
                                showSizeChanger: false,
                                showQuickJumper: false,
                            }}
                            scroll={{ x: 800 }}
                        />
                    </Flex>
                </Content>
            </Layout>
        </Layout>
    );
}
