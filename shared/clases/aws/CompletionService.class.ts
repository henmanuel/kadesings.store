import {BedrockRuntimeClient, ConverseStreamCommand} from '@aws-sdk/client-bedrock-runtime';
import {ICompletionService} from '../../interfaces/IProcessContext.interface';
import {Queue} from "../Queue.class";
import {SignalAPI} from "../SignalAPI.class";
import {HttpRequest} from "../HttpRequest.class";

export interface CompletionInstruction {
    topP?: number;
    temperature?: number;
    maxTokensToSample?: number;

    domainTopic?: string;
    specialist?: string;
    timePeriod?: string;
    businessName?: string;
    knowledgeDepth?: string;
    interactionFlow?: string;
    fallbackResponse?: string;
    sourcePreference?: string;
    communicationStyle?: string;
    ethicalLimitations?: string[];
}

type Role = 'system' | 'user' | 'assistant';

export interface Message {
    role: Role;
    content: string;
}

export class CompletionService implements ICompletionService {
    config: CompletionInstruction;
    private readonly modelId: string;
    private client: BedrockRuntimeClient;
    private readonly toolDefinition: any;

    constructor(region: string, modelId: string, config: CompletionInstruction = {}) {
        this.client = new BedrockRuntimeClient({ region });
        this.modelId = modelId;
        this.config = config;

        this.toolDefinition = {
            tools: [
                {
                    "toolSpec": {
                        "name": "search_flight",
                        "description": "Search for available flights using a GDS (Global Distribution System).",
                        "inputSchema": {
                            "json": {
                                "type": "object",
                                "properties": {
                                    "departureDateTime": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "The departure date and time for the flight in ISO 8601 format. Example: '2024-09-24T00:00:00'."
                                    },
                                    "originLocation": {
                                        "type": "object",
                                        "properties": {
                                            "IATA": {
                                                "type": "string",
                                                "description": "The IATA code for the origin airport. Example: 'WAW' for Warsaw Chopin Airport."
                                            },
                                            "name": {
                                                "type": "string",
                                                "description": "The name of the origin airport."
                                            },
                                            "city": {
                                                "type": "string",
                                                "description": "The city where the origin airport is located."
                                            },
                                            "country": {
                                                "type": "string",
                                                "description": "The country where the origin airport is located."
                                            }
                                        },
                                        "required": ["IATA", "name", "city", "country"]
                                    },
                                    "destinationLocation": {
                                        "type": "object",
                                        "properties": {
                                            "IATA": {
                                                "type": "string",
                                                "description": "The IATA code for the destination airport. Example: 'SPU' for Split Airport."
                                            },
                                            "name": {
                                                "type": "string",
                                                "description": "The name of the destination airport."
                                            },
                                            "city": {
                                                "type": "string",
                                                "description": "The city where the destination airport is located."
                                            },
                                            "country": {
                                                "type": "string",
                                                "description": "The country where the destination airport is located."
                                            }
                                        },
                                        "required": ["IATA", "name", "city", "country"]
                                    },
                                    "returnDateTime": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "The return date and time for the flight in ISO 8601 format, if applicable."
                                    },
                                    "passengerType": {
                                        "type": "string",
                                        "description": "The type of passenger. Possible values are: 'ADT' (Adult, over 12 years), 'CNN' (Child, between 2 and 11 years), 'INF' (Infant, under 2 years, without occupying a seat), 'SRC' (Senior passenger), 'UNN' (Unaccompanied minor), 'MIL' (Active service military), 'GVT' (Government traveler), 'MIS' (Missionary).",
                                        "enum": ["ADT", "CNN", "INF", "SRC", "UNN", "MIL", "GVT", "MIS"]
                                    },
                                    "passengerCount": {
                                        "type": "integer",
                                        "description": "The number of passengers."
                                    },
                                    "CabinPref": {
                                        "type": "object",
                                        "properties": {
                                            "Cabin": {
                                                "type": "string",
                                                "enum": ["P", "F", "J", "C", "S", "Y"],
                                                "description": "Preferred cabin class. Possible values: 'P' (Premium First), 'F' (First), 'J' (Premium Business), 'C' (Business), 'S' (Premium Economy), 'Y' (Economy)."
                                            },
                                            "PreferLevel": {
                                                "type": "string",
                                                "enum": ["Preferred"],
                                                "description": "Level of preference. Possible values: 'Preferred'."
                                            }
                                        },
                                        "required": ["Cabin", "PreferLevel"],
                                        "description": "Passenger's cabin class preference."
                                    },
                                    "baggageInfo": {
                                        "type": "object",
                                        "properties": {
                                            "MaxStopsQuantity": {
                                                "type": "integer",
                                                "description": "Maximum number of stops allowed."
                                            },
                                            "Baggage": {
                                                "type": "object",
                                                "properties": {
                                                    "RequestType": {
                                                        "type": "string",
                                                        "enum": ["A", "C", "B", "CC", "E", "P", "EE"],
                                                        "description": "Baggage provision type. Possible values: 'A' (Checked baggage allowance), 'C' (Day of check-in charges), 'B' (Carry-on baggage allowance), 'CC' (Carry-on baggage charges), 'E' (Baggage embargo), 'P' (Prepaid checked baggage charges), 'EE' (Generic embargo: No excess permitted)."
                                                    },
                                                    "Description": {
                                                        "type": "boolean",
                                                        "description": "Indicates whether to include a description of the baggage."
                                                    }
                                                },
                                                "required": ["RequestType", "Description"],
                                                "description": "Details of the baggage request."
                                            }
                                        },
                                        "required": ["MaxStopsQuantity", "Baggage"],
                                        "description": "Information related to baggage and stops."
                                    }
                                },
                                "required": [
                                    "departureDateTime",
                                    "originLocation",
                                    "destinationLocation",
                                    "returnDateTime",
                                    "passengerType",
                                    "passengerCount"
                                ]
                            }
                        }
                    }
                },
                {
                    "toolSpec": {
                        "name": "create_signal_group",
                        "description": "Create a new Signal group with the specified name and members.",
                        "inputSchema": {
                            "json": {
                                "type": "object",
                                "properties": {
                                    "group_name": {
                                        "type": "string",
                                        "description": "short signal group name"
                                    }
                                },
                                "required": ["group_name"]
                            }
                        }
                    }
                },
                {
                    "toolSpec": {
                        "name": "send_email",
                        "description": "Send an email with the specified subject, body whit travel details",
                        "inputSchema": {
                            "json": {
                                "type": "object",
                                "properties": {
                                    "subject": {
                                        "type": "string",
                                        "description": "The subject of the email."
                                    },
                                    "body": {
                                        "type": "string",
                                        "description": "The body content of the email with HTML tags. Travel details"
                                    }
                                },
                                "required": ["subject", "body"]
                            }
                        }
                    }
                }
            ]
        };
    }

    private async processToolUse(toolUse: any) {
        if (toolUse.name === "search_flight") {

            try {
                return await this.searchFlight(toolUse.input) || '';
            } catch (e: any) {
                return '';
            }
        }

        if (toolUse.name === "send_email") {
            try {
                await Queue.notification([{
                    'to': [
                        'henmanuelvargas@creai.mx'
                    ],
                    'from': 'henmanuelvargas@creai.mx',
                    'data': {
                        'TXT': toolUse.input.body || 'Cotización enviada, revisa el grupo en signal'
                    },
                    'templateName': 'simpleTXT',
                    'subject': toolUse.input.subject || 'Envío de cotización'
                }], 'email', 'SES');

                return '\n\nMe confirma recibido'
            } catch (e: any) {
                return '';
            }
        }

        if (toolUse.name === "create_signal_group") {
            try {
                const signal: SignalAPI = new SignalAPI();
                const group = await signal.createGroup(toolUse.input.group_name || 'Viaje', ['+50672716641'], '+50685186681');

                console.log('Signal grou', group);
                await signal.sendMessages('+50685186681', 'Cotización del viaje', [group?.data?.id], [this.file]);
                return '\n\nEspero haberle ayudado al máximo.\n';
            } catch (e: any) {
                return '';
            }
        }
    }

    private async searchFlight(input: any) {
        const request = new HttpRequest('https://ykxryz6zdk.execute-api.eu-central-1.amazonaws.com/Stage/search');
        const response = await request.post(input);

        if (response.status === 201) {
            return response.data;
        } if (response.status === 404) {
            return 'El vuelo no se encontró en las fechas especificadas. ¿Te gustaría que busque opciones en fechas cercanas?';
        }

        return 'En este momento no podemos acceder al sistema de búsquedas. Por favor, inténtalo más tarde.';
    }

    private concatenateMessages(messages: any) {
        if (messages.length === 0) return [];
        while (messages.length > 0 && messages[0].role !== 'user') {
            messages.shift();
        }

        if (messages.length === 0) return [];

        const result = [];
        let currentRole = messages[0].role;
        let currentContent = messages[0].content;

        for (let i = 1; i < messages.length; i++) {
            if (messages[i].role === currentRole) {
                currentContent += '\n\n' + messages[i].content;
            } else {
                result.push({ role: currentRole, content: currentContent });
                currentRole = messages[i].role;
                currentContent = messages[i].content;
            }
        }

        result.push({ role: currentRole, content: currentContent });
        return result;
    }

    private async create(systemPrompt: string, messages: any, onChunkReceived?: (chunk: any) => void): Promise<any> {
        const processedMessages: any = this.concatenateMessages(messages);
        const requestPayload = {
            modelId: this.modelId,
            messages: processedMessages.map((msg: { role: any; content: any; }) => ({
                role: msg.role,
                content: [{ text: msg.content }]
            })),
            system: [
                { text: systemPrompt }
            ],
            toolConfig: this.toolDefinition
        };

        console.log('LLM Request', requestPayload);
        const command: ConverseStreamCommand = new ConverseStreamCommand(requestPayload);
        const responseStream: any = await this.client.send(command);

        let text: string = '';
        let tool_use: any = {};
        for await (const parsedChunk of responseStream.stream) {
            if (parsedChunk) {
                if (parsedChunk.contentBlockStart) {
                    const tool = parsedChunk.contentBlockStart.start.toolUse;
                    tool_use = { toolUseId: tool.toolUseId, name: tool.name, input: '' };
                } else if (parsedChunk.contentBlockDelta) {
                    const delta = parsedChunk.contentBlockDelta.delta;
                    if (delta.toolUse) {
                        tool_use.input += delta.toolUse.input;
                    } else if (delta.text) {
                        text += delta.text;
                        if (onChunkReceived) {
                            onChunkReceived(delta.text);
                        }
                    }
                } else if (parsedChunk.contentBlockStop) {
                    if (tool_use.input) {
                        tool_use.input = JSON.parse(tool_use.input);

                        if (onChunkReceived) {
                            onChunkReceived('\n\n');
                        }

                        const toolResult: string = await this.processToolUse(tool_use);

                        if (onChunkReceived) {
                            onChunkReceived(toolResult);
                        }
                    }
                } else if (parsedChunk.messageStop) {
                    const stop_reason = parsedChunk.messageStop.stopReason;
                    if (stop_reason && onChunkReceived) {
                        onChunkReceived('\n\n[DONE]\n\n');
                    }
                }
            }
        }
    }

    private getCurrentPanamaDateTime(): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'America/Panama',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        const formatter = new Intl.DateTimeFormat('es-PA', options);
        const formattedDate = formatter.format(new Date());

        return `${formattedDate} (Hora de Panamá)`;
    }

    async answerQuestion(message: string, content: string, messages: Message[], onChunkReceived: (chunk: any) => void): Promise<any> {
        const {
            domainTopic = '',
            specialist = '',
            businessName = '',
            interactionFlow = '',
            communicationStyle = '',
            fallbackResponse = 'Lo siento, no tengo información sobre eso.',
        } = this.config;

        const currentPanamaDateTime = this.getCurrentPanamaDateTime();

        let flow = '';
        if (interactionFlow) {
            flow = `Sigue este flujo específico en todas las interacciones relacionadas con tema de dominio: ${interactionFlow}`;
        }

        const systemPrompt: string = `
            Hoy es ${currentPanamaDateTime},
            Eres un asistente especializado en ${specialist} de la organización ${businessName}, y tu dominio es exclusivamente ${domainTopic}.
            Tu estilo de comunicación es ${communicationStyle}, Debes preferir fuentes verificables.
            Siempre responde a saludos, despedidas, cumplidos y preguntas estrictamente relacionadas con el contenido: '${content}'.
            No te desvíes hacia áreas diferentes a ${specialist} y no respondas a preguntas generales o triviales que no estén relacionadas con ${domainTopic}.
            Si una pregunta se aleja de tu especialización (${specialist}), requiere conocimientos,habilidades adicionales, te genera dudas o no está relacionada con el contenido, usa la frase: '${fallbackResponse}', pero siempre intenta dar una solución.
            Recuerda responder en primera persona o en nombre de la organización cuando sea pertinente, manteniendo siempre el contexto estricto de tu especialización y contenido indicado.
            Ten en cuenta la fecha y hora indicadas aquí y conviértelas al huso horario del lugar de partida cuando el usuario no sea específico. Además, cuando el usuario mencione un día de la semana sin especificar a qué semana se refiere, asume la fecha más cercana partiendo de la fecha actual.
            Siempre considera las preferencias del usuario para ${domainTopic}. ${flow}
            Nota: Si una pregunta se aleja de tu especialización, requiere conocimientos adicionales, te genera dudas o no está relacionada con el contenido, usa la frase: '${fallbackResponse}', pero siempre intenta dar una solución.
            Recuerda responder en primera persona o en nombre de la organización cuando sea pertinente, manteniendo siempre el contexto estricto de tu especialización y el contenido indicado.
            NO TE SALGAS DEL CONTENIDO, TEMAS O ESPECIALIZACIÓN INDICADA.
        `;

        console.log('LLM System Prompt', systemPrompt);
        console.log('LLM User Prompt', message);

        await this.create(systemPrompt, [
            ...messages,
            { role: 'user', content: message }
        ], onChunkReceived);
    }
}
