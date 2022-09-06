import { BuildMessageDataSpec } from './messengers/interfaces'

export interface RadiatorSpec {
  authorized?: boolean;
}

export interface MessageService {
  sendMessages(messageData: BuildMessageDataSpec): void;
}

export interface RadiatorService {
  getName(): string;
  perform(results: BuildMessageDataSpec, radiator: RadiatorSpec): Promise<BuildMessageDataSpec>;
}
