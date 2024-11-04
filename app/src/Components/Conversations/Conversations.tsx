import React from 'react';
import { Layout, Input, Button, List, Card, Avatar, Typography, Flex, theme, Grid } from 'antd';

import {
    TeamOutlined,
    PlusOutlined,
    MenuOutlined,
    SearchOutlined
} from '@ant-design/icons';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const {Sider, Content } = Layout;
const { Title, Text } = Typography;

export function Conversations(): React.ReactElement {
    const { token } = useToken();
    const screens = useBreakpoint();

    const conversations = [
        { id: '450293', name: 'Ericka Consigna', message: 'Hola, tengo un problema con mi paquete.', duration: '5 minutos' },
        { id: '450294', name: 'Juan Pérez', message: 'Hola, tengo un problema con mi paquete.', duration: '5 minutos' },
        { id: '450295', name: 'Alejandra Aguilar', message: 'Hola, tengo un problema con mi paquete.', duration: '5 minutos' },
        { id: '450296', name: 'Michael Smith', message: 'Hola, tengo un problema con mi paquete.', duration: '5 minutos' },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ padding: token.padding, background: token.colorBgContainer }}>
                    <Flex vertical gap={token.marginMD}>
                        <Title level={4}>Conversaciones</Title>
                        <Flex gap={token.marginSM} align="center">
                            <Input placeholder="Buscar conversaciones" prefix={<SearchOutlined />} />
                            <Button icon={<PlusOutlined />}>Filtrar por</Button>
                            <Button icon={<MenuOutlined />} />
                        </Flex>
                        <List
                            dataSource={conversations}
                            renderItem={(item) => (
                                <Card
                                    size="small"
                                    style={{ marginBottom: token.marginSM }}
                                    hoverable
                                >
                                    <Flex justify="space-between" align="center">
                                        <Flex vertical>
                                            <Text strong>{item.name}</Text>
                                            <Text type="secondary">{item.message}</Text>
                                        </Flex>
                                        <Text type="secondary">Hoy</Text>
                                    </Flex>
                                    <Flex justify="space-between" align="center" style={{ marginTop: token.marginSM }}>
                                        <Text type="secondary">Duración: {item.duration}</Text>
                                        <Button type="link">Ver conversación</Button>
                                    </Flex>
                                </Card>
                            )}
                        />
                    </Flex>
                </Content>
                <Sider theme="light" width={screens.lg ? 400 : 300}>
                    <Flex vertical style={{ height: '100%', padding: token.padding }}>
                        <Title level={5}>ID: {conversations[0].id}</Title>
                        <Flex align="center" style={{ marginBottom: token.marginMD }}>
                            <Avatar size="small" icon={<TeamOutlined />} />
                            <Text style={{ marginLeft: token.marginXS }}>Usuario</Text>
                            <Text type="secondary" style={{ marginLeft: 'auto' }}>11:46</Text>
                        </Flex>
                        <Card style={{ background: token.colorBgContainerDisabled, marginBottom: token.marginSM }}>
                            <Text>Hola! Tengo un problema con mi paquete</Text>
                        </Card>
                        <Text type="secondary" style={{ alignSelf: 'flex-start', marginBottom: token.marginMD }}>Recibido</Text>
                        <Flex align="center" style={{ marginBottom: token.marginSM }}>
                            <Avatar size="small" src="https://placehold.co/40x40" />
                            <Text type="secondary" style={{ marginLeft: 'auto' }}>11:46</Text>
                        </Flex>
                        <Card style={{ background: token.colorPrimary, marginBottom: token.marginSM }}>
                            <Text style={{ color: token.colorWhite }}>Claro, déjame validar tu información.</Text>
                        </Card>
                        <Text type="secondary" style={{ alignSelf: 'flex-end', marginBottom: token.marginMD }}>Enviado</Text>
                        <Flex align="center" style={{ marginBottom: token.marginSM }}>
                            <Avatar size="small" icon={<TeamOutlined />} />
                            <Text style={{ marginLeft: token.marginXS }}>Usuario</Text>
                            <Text type="secondary" style={{ marginLeft: 'auto' }}>11:46</Text>
                        </Flex>
                        <Card style={{ background: token.colorBgContainerDisabled, marginBottom: token.marginSM }}>
                            <Text>Perfecto, gracias</Text>
                        </Card>
                        <Text type="secondary" style={{ alignSelf: 'flex-start', marginBottom: token.marginMD }}>Recibido</Text>
                        <Flex align="center" style={{ marginBottom: token.marginSM }}>
                            <Avatar size="small" src="https://placehold.co/40x40" />
                            <Text type="secondary" style={{ marginLeft: 'auto' }}>11:46</Text>
                        </Flex>
                        <Card style={{ background: token.colorPrimary }}>
                            <Text style={{ color: token.colorWhite }}>Revisando en el sistema podemos verificar que su paquete presenta un atraso de 2 días</Text>
                        </Card>
                        <Text type="secondary" style={{ alignSelf: 'flex-end' }}>Enviado</Text>
                    </Flex>
                </Sider>
            </Layout>
        </Layout>
    );
}
