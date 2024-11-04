import { EmbeddingService } from './openAI/EmbeddingService.class';
import { FineTuneService, IFineTuneService } from './openAI/FineTuneService.class';
import { AssistantService, IAssistantService } from './openAI/AssistantService.class';
import { CompletionInstruction, CompletionService } from './openAI/CompletionService.class';
import { ICompletionService, IEmbeddingService } from '../interfaces/IProcessContext.interface';
import { ITranscriptionService, TranscriptionService } from './openAI/TranscriptionService.class';

export class LLMHandler {
    private readonly fineTuneService: IFineTuneService;
    private readonly assistantService: IAssistantService;
    private readonly embeddingService: IEmbeddingService;
    private readonly completionService: ICompletionService;
    private readonly transcriptionService: ITranscriptionService;

    constructor(url: string, apiKey: string = '') {
        this.fineTuneService = new FineTuneService(url, apiKey);
        this.assistantService = new AssistantService(url, apiKey);
        this.embeddingService = new EmbeddingService(url, apiKey);
        this.completionService = new CompletionService(url, apiKey);
        this.transcriptionService = new TranscriptionService(url, apiKey);
    }

    getCompletionService(config: CompletionInstruction): ICompletionService {
        this.completionService.config = config;
        return this.completionService;
    }

    getFineTuneService(): IFineTuneService {
        return this.fineTuneService;
    }

    getEmbeddingService(): IEmbeddingService {
        return this.embeddingService;
    }

    getTranscriptionService(): ITranscriptionService {
        return this.transcriptionService;
    }

    getAssistantService(): IAssistantService {
        return this.assistantService;
    }
}
