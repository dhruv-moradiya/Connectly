interface IWelcomeMessage {
  data: string;
}

interface IConnectError {
  data: {
    message: string;
  };
}

interface IDisconnect {
  data: {
    message: string;
  };
}

interface IReconnectAttampt {
  reason: string;
}

interface IReconnect {
  attemptNumber: number;
}

interface IChatCreated {}

export type { IWelcomeMessage };
