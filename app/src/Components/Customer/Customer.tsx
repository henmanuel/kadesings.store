import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChartOutlined, MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;

export function Customer(): React.ReactElement {
    const location = useLocation();

    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{pathSnippets[index]}</Link>
            </Breadcrumb.Item>
        );
    });

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} theme="light">
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="/metrics" icon={<BarChartOutlined />}>
                        <Link to="metrics">Métricas</Link>
                    </Menu.Item>
                    <Menu.Item key="/conversations" icon={<MessageOutlined />}>
                        <Link to="conversations">Conversaciones</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="sub1" icon={<SettingOutlined />} title="Configuración">
                        <Menu.Item key="/settings/personality">
                            <Link to="settings/personality">Personalidad</Link>
                        </Menu.Item>
                        <Menu.Item key="/settings/flows">
                            <Link to="settings/flows">Flujos</Link>
                        </Menu.Item>
                        <Menu.Item key="/settings/training">
                            <Link to="settings/training">Entrenamiento</Link>
                        </Menu.Item>
                        <Menu.Item key="/settings/channels">
                            <Link to="settings/channels">Canales</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="sub2" icon={<SettingOutlined />} title="Ajustes">
                        <Menu.Item key="/settings/users" icon={<UserOutlined />}>
                            <Link to="settings/users">Usuarios</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item key="home">
                            <Link to="/">Inicio</Link>
                        </Breadcrumb.Item>
                        {breadcrumbItems}
                    </Breadcrumb>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
