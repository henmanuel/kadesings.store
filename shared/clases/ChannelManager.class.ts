import {MessageFromQueueI, MessageI} from '../../Messages/domain/Message.model';
import {ChatbotI} from '../../Chatbot/domain/Chatbot.model';
import {WhatsAppBusiness} from './WhatsAppBusiness';
import {SignalAPI} from './SignalAPI.class';
import {Utils} from "./Utils.class";

import {
    PostToConnectionCommand,
    PostToConnectionCommandOutput,
    ApiGatewayManagementApiClient
} from '@aws-sdk/client-apigatewaymanagementapi';

const apiGateway: ApiGatewayManagementApiClient = new ApiGatewayManagementApiClient({
    endpoint: process.env.WEBSOCKET_ENDPOINT
});

export class ChannelManager {
    constructor(private body: MessageFromQueueI, private chatbot: ChatbotI) {}

    async response (message: string, finalMessages: MessageI[]): Promise<MessageI[]> {
        let wsResponse;
        const whatsapp: WhatsAppBusiness = new WhatsAppBusiness(this.chatbot.whatsappConfig?.phoneNumberId || '', this.chatbot.whatsappConfig?.accessToken || '');

        const regexBase64 = /(.*?)(data:application\/pdf;base64,)(.+)/;
        const matches = message.match(regexBase64) || [];

        if (this.body.product == 'whatsapp_business_account') {
            if (matches && matches.length > 3) {
                const initialString: string = matches[1];
                const base64String: string = message.replace(initialString || '', '');

                if (base64String) {
                    if (initialString) {
                        console.log('send whatsapp initialString', message);
                        wsResponse = await whatsapp.sendMessage({
                            to: this.body.channelId,
                            type: 'text',
                            text: {
                                body: initialString,
                                preview_url: false
                            },
                            messaging_product: 'whatsapp'
                        });
                    }

                    console.log('send whatsapp base64');
                    const base64 = base64String.split(',').pop() || '';
                    const bufferFile = Buffer.from(base64, 'base64');
                    const uploadFIle = await whatsapp.uploadMedia(bufferFile, 'application/pdf', `quote-${Utils.nowTimeStamp()}.pdf`);

                    if (uploadFIle?.id) {
                        wsResponse = await whatsapp.sendMessage({
                            type: 'document',
                            to: this.body.channelId,
                            messaging_product: 'whatsapp',
                            document: {
                                id: uploadFIle.id,
                                filename: `quote-${Utils.nowTimeStamp()}.pdf`
                            }
                        });

                        if (wsResponse?.data?.messages[0]?.id) {
                            finalMessages.push({
                                text: message,
                                senderId: 'assistant',
                                id: wsResponse.data.messages[0].id
                            });
                        }
                    }
                }
            } else {
                console.log('send whatsapp', message);
                wsResponse = await whatsapp.sendMessage({
                    to: this.body.channelId,
                    type: 'text',
                    text: {
                        body: message,
                        preview_url: false
                    },
                    messaging_product: 'whatsapp'
                });
            }

            if (wsResponse?.data?.messages[0]?.id) {
                finalMessages.push({
                    text: message,
                    senderId: 'assistant',
                    id: wsResponse.data.messages[0].id
                });
            }
        }

        if (this.body.product == 'page') {
            wsResponse = await whatsapp.sendMessengerMessage({
                text: message,
                messaging_type: 'RESPONSE',
                recipientId: this.body.channelId
            });

            if (wsResponse?.data?.message_id) {
                finalMessages.push({
                    text: message,
                    senderId: 'assistant',
                    id: wsResponse?.data?.message_id
                });
            }
        }

        if (this.body.product == 'signal') {
            let wsResponse: any;
            let final: string = '';
            const signal: SignalAPI = new SignalAPI();

            if (matches && matches.length > 3) {
                const initialString: string = matches[1];
                const base64String: string = message.replace(initialString || '', '');

                if (base64String) {
                    if (initialString) {
                        console.log('send signal initialString', message);
                        wsResponse = await signal.sendMessages(this.chatbot.externalId || '', initialString, [
                            this.body.channelId
                        ]);
                    }

                    console.log('send signal base64');
                    wsResponse = await signal.sendMessages(this.chatbot.externalId || '', '', [
                        this.body.channelId
                    ], [base64String]);

                    if (wsResponse?.status == 201) {
                        final = 'Revisa el PDF con la cotización y dime si estás de acuerdo.';
                        wsResponse = await signal.sendMessages(this.chatbot.externalId || '', final, [
                            this.body.channelId
                        ]);

                        if (wsResponse?.status != 201) {
                            final = ''
                        }
                    }
                }
            } else {
                console.log('send signal', message);
                wsResponse = await signal.sendMessages(this.chatbot.externalId || '', message, [
                    this.body.channelId
                ]);
            }

            if (wsResponse?.status == 201) {
                finalMessages.push({
                    text: message,
                    senderId: 'assistant',
                    id: Utils.nowTimeStamp().toString()
                });

                if (final) {
                    finalMessages.push({
                        text: message,
                        senderId: 'assistant',
                        id: Utils.nowTimeStamp().toString()
                    });
                }
            }
        }

        if (this.body.product == 'web') {
            console.log('socket', message);
            if (this.body?.connectionId) {
                const postToConnectionCommand: PostToConnectionCommand = new PostToConnectionCommand({
                    ConnectionId: this.body.connectionId,
                    Data: JSON.stringify({message: message})
                });

                const socketResponse: PostToConnectionCommandOutput = await apiGateway.send(postToConnectionCommand);
                console.log('socketResponse', socketResponse);

                if (socketResponse?.$metadata?.httpStatusCode == 200) {
                    finalMessages.push({
                        text: message,
                        senderId: 'assistant',
                        id: Utils.nowTimeStamp().toString()
                    });
                }
            }
        }

        return finalMessages;
    }
}
