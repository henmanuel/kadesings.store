import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, Layout, Typography } from 'antd';
import { CloseOutlined, MessageOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const defaultCustomization = {
    colors: { primary: "#000000", text: "#FFFFFF", icon: "#000000" },
    position: { location: "bottom-right", horizontalSpacing: 20, verticalSpacing: 20 },
    dimensions: { width: 470, height: 500 },
    botIcon: {
        shape: "circular",
        roundness: 50,
        imageUrl: "https://s3.amazonaws.com/bucketname/path/to/image.png",
        imageEnabled: true
    }
};

const defaultConfig = {
    greeting: 'Hola, ¿cómo puedo ayudarte?', description: 'AI Assistant', name: 'Cargo', messageDefault: 'Hello'
};

export interface ChatbotProps {
    wsUrl: string;
    chatbotId?: string;
}

interface Message {
    text: string;
    isUser: boolean;
}

export function Chatbot({ wsUrl, chatbotId }: ChatbotProps): React.ReactElement {
    const params = useParams<{ chatbotId: string }>();
    chatbotId = chatbotId || params?.chatbotId || '0';

    const [inputText, setInputText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([{ text: defaultConfig.greeting, isUser: false }]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const [clientId] = useState<string>(() => {
        const storedClientId = window.localStorage.getItem('chatbotClientId');
        return storedClientId || uuidv4();
    });

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        connectWebSocket();
        return () => socket?.close();
    }, [clientId]);

    const connectWebSocket = () => {
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => console.log('WebSocket Connected');
        newSocket.onmessage = (e) => {
            const messageData = JSON.parse(e.data);
            setMessages((prev) => [...prev, { text: messageData.message, isUser: false }]);
        };

        newSocket.onclose = () => console.log('WebSocket connection closed');
        newSocket.onerror = (error) => console.error('WebSocket Error:', error);
        setSocket(newSocket);
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setIsProcessing(true);
        setMessages((prev) => [...prev, { text: inputText, isUser: true }]);
        socket?.send(JSON.stringify({ action: 'sendmessage', from: clientId, message: inputText, chatbotId }));
        setInputText('');
        setTimeout(() => setIsProcessing(false), 1000);
    };

    const toggleMinimize = () => setIsMinimized(!isMinimized);

    const messageStyle = (isUser: boolean): React.CSSProperties => ({
        backgroundColor: isUser ? '#007bff' : '#f0f0f0',
        color: isUser ? '#fff' : '#000',
        padding: '8px 16px',
        borderRadius: '8px',
        maxWidth: '80%',
        margin: isUser ? '0 0 8px auto' : '0 auto 8px 0',
        textAlign: 'left'
    });

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: defaultCustomization.dimensions.width,
            zIndex: 1000
        }}>
            {isMinimized ? (
                <Button
                    type="primary"
                    shape="circle"
                    icon={<MessageOutlined />}
                    size="large"
                    onClick={toggleMinimize}
                    style={{ backgroundColor: defaultCustomization.colors.primary }}
                />
            ) : (
                <Layout style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    width: '100%',
                    height: defaultCustomization.dimensions.height
                }}>
                    <Header style={{
                        backgroundColor: defaultCustomization.colors.primary,
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: defaultCustomization.colors.text }}>{defaultConfig.name}</Text>
                        <div>
                            <Button type="link" icon={<SyncOutlined />}
                                    onClick={() => setMessages([{ text: defaultConfig.greeting, isUser: false }])} />
                            <Button type="link" icon={<CloseOutlined />} onClick={toggleMinimize} />
                        </div>
                    </Header>
                    <Content ref={messagesContainerRef}
                             style={{ padding: '16px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={messageStyle(msg.isUser)}>
                                {msg.isUser ? (
                                    <Text>{msg.text}</Text>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar size="small" icon={<MessageOutlined />} style={{
                                            backgroundColor: defaultCustomization.colors.icon,
                                            marginRight: 8
                                        }} />
                                        <Text>{msg.text}</Text>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Content>
                    <Footer style={{ padding: '8px 16px', backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
                        <Input
                            placeholder="Escribe tu mensaje..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onPressEnter={handleSendMessage}
                            style={{ marginRight: 8 }}
                            disabled={isProcessing}
                        />
                        <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSendMessage} disabled={isProcessing} />
                    </Footer>
                </Layout>
            )}
        </div>
    );
}
