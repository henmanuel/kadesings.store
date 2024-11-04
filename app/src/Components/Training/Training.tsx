import React from 'react';
import { Layout, Typography, Input, Tabs, List, Card, Button, Flex, theme, Grid } from 'antd';

import {
  EditOutlined,
  PlusOutlined,
  GlobalOutlined,
  SearchOutlined,
  QuestionOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const {Content} = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title, Paragraph, Text } = Typography;

export function Training(): React.ReactElement {
  const { token } = useToken();
  const screens = useBreakpoint();

  const documents = [
    { title: 'URL', description: 'https://www.cargoexpreso.com', date: '9/20/2024, 12:35 PM', status: 'Completada' },
    { title: 'FAQ', description: '.txt', date: '9/20/2024, 12:35 PM', status: 'Completada' },
    { title: 'PDF', description: 'Cargo Expreso Guidelines', date: '9/20/2024, 12:35 PM', status: 'Completada' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Content style={{ padding: token.padding, background: token.colorBgContainer }}>
          <Flex vertical gap={token.marginMD}>
            <Title level={2}>Entrenamiento</Title>
            <Paragraph>
              Para entrenar al agente virtual, se emplean fuentes de información, como el contenido extraído de un sitio web. Si desea agregar una fuente de datos, por favor, elija uno de los tipos a continuación.
            </Paragraph>
            <Input
              placeholder="Buscar documentos"
              prefix={<SearchOutlined />}
              style={{ maxWidth: 300 }}
            />
            <Tabs defaultActiveKey="1" items={[
              { key: '1', label: 'Todos' },
              { key: '2', label: 'Pendientes' },
              { key: '3', label: 'Borrados' },
            ]} />
            <List
              dataSource={documents}
              renderItem={(item) => (
                <List.Item>
                  <Flex vertical>
                    <Text strong>{item.title}</Text>
                    <Text>{item.description}</Text>
                    <Text type="secondary">{item.date}</Text>
                    <Text type="success">{item.status}</Text>
                  </Flex>
                </List.Item>
              )}
            />
            <Flex gap={token.marginMD} wrap="wrap">
              <Card hoverable style={{ width: 200 }}>
                <Flex vertical align="center" gap={token.marginSM}>
                  <DownloadOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
                  <Text strong>Subir archivos</Text>
                  <Text type="secondary">Archivos admitidos: TXT, PDF</Text>
                  <Button type="primary">Subir</Button>
                </Flex>
              </Card>
              <Card hoverable style={{ width: 200 }}>
                <Flex vertical align="center" gap={token.marginSM}>
                  <EditOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
                  <Text strong>A partir de texto</Text>
                  <Text type="secondary">Escribe o pega tu contenido</Text>
                  <Button type="primary">Agregar</Button>
                </Flex>
              </Card>
              <Card hoverable style={{ width: 200 }}>
                <Flex vertical align="center" gap={token.marginSM}>
                  <QuestionOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
                  <Text strong>A partir de preguntas</Text>
                  <Text type="secondary">Entrenar a partir de ejemplos de preguntas</Text>
                  <Button type="primary">Agregar</Button>
                </Flex>
              </Card>
            </Flex>
            <Card>
              <Flex vertical gap={token.marginSM}>
                <Flex align="center" gap={token.marginXS}>
                  <GlobalOutlined />
                  <Text strong>Desde una página web</Text>
                </Flex>
                <Text type="secondary">Pega aquí la URL</Text>
                <Input placeholder="https://..." />
                <Button type="primary" style={{ alignSelf: 'flex-start' }}>Subir</Button>
              </Flex>
            </Card>
            <Button icon={<PlusOutlined />} type="dashed">Nuevo documento</Button>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
}
