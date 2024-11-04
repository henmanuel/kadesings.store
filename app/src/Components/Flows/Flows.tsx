import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Layout, Typography, Input, Button, Flex, Breadcrumb, theme } from 'antd';

const {Content} = Layout;
const { useToken } = theme;
const { Title, Paragraph } = Typography;

export function Flows(): React.ReactElement {
    const { token } = useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ padding: 24, margin: 0, minHeight: 280, background: token.colorBgContainer }}>
                    <Title level={2}>Flujos</Title>
                    <Paragraph>
                        En esta sección, configura los flujos de interacción del agente virtual. Define cómo responderá el agente a las entradas del usuario, las decisiones que tomará y las posibles rutas de conversación para ofrecer una experiencia fluida y efectiva.
                    </Paragraph>
                    <Flex justify="flex-end" style={{ marginBottom: token.marginMD }}>
                        <Button type="primary" icon={<PlusOutlined />} />
                    </Flex>
                    <Flex vertical gap={token.marginLG}>
                        <Flex vertical gap={token.marginXS}>
                            <Typography.Text strong>Consulta tracking</Typography.Text>
                            <Input placeholder="example" />
                        </Flex>
                        <Flex vertical gap={token.marginXS}>
                            <Typography.Text strong>Fuera de tiempo</Typography.Text>
                            <Input placeholder="example" />
                        </Flex>
                        <Flex gap={token.marginXS}>
                            <Button type="primary">Guardar</Button>
                        </Flex>
                    </Flex>
                </Content>
            </Layout>
        </Layout>
    );
}
