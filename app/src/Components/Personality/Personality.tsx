import React from 'react';
import { Layout, Form, Input, Button, Typography, theme, Grid } from 'antd';

const { Title, Paragraph } = Typography;
const { Header, Content} = Layout;
const { useBreakpoint } = Grid;
const { useToken } = theme;

export function Personality(): React.ReactElement {
    const { token } = useToken();
    const screens = useBreakpoint();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div style={{ padding: 24, background: token.colorBgContainer }}>
                        <Title level={2} style={{ marginTop: token.marginMD }}>Personalidad</Title>
                        <Paragraph>
                            En esta sección, configura la identidad y el estilo de comunicación de tu agente virtual. Define su nombre, rol, temas principales y estilo de interacción para ofrecer una experiencia coherente con tu negocio.
                        </Paragraph>
                        <Form layout="vertical" style={{ maxWidth: 600 }}>
                            <Form.Item label="Nombre de agente">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="Business name">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="Communication style">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="Domain topics">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="Fallback response">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="Rol">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="...">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="default">Guardar</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
