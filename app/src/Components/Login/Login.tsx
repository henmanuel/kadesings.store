import React from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Flex, theme } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, QuestionCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { useToken } = theme;

export function Login(): React.ReactElement {
    const { token } = useToken();

    return (
        <Flex justify="center" align="center" style={{ height: '100vh', background: token.colorBgLayout }}>
            <Card style={{ width: 350, borderRadius: token.borderRadiusLG }}>
                <Flex vertical align="center" gap={token.marginMD}>
                    <img src="https://placehold.co/150x50" alt="Creai logo" style={{ marginBottom: token.marginSM }} />
                    <Title level={4} style={{ margin: 0 }}>Inicia sesión</Title>
                    <Form layout="vertical" style={{ width: '100%' }}>
                        <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingrese su correo electrónico' }]}>
                            <Input placeholder="Correo electrónico" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}>
                            <Input.Password
                                placeholder="Contraseña"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                        <Flex justify="space-between" align="center" style={{ marginBottom: token.marginSM }}>
                            <Checkbox>Recuérdame</Checkbox>
                            <Typography.Link>Olvidaste tu contraseña?</Typography.Link>
                        </Flex>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Iniciar sesión
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Card>
            <QuestionCircleOutlined style={{ position: 'fixed', right: token.margin, bottom: token.margin, fontSize: token.fontSizeLG }} />
        </Flex>
    );
}
