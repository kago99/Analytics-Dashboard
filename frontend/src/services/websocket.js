export class WebSocketClient {
  constructor(url, onMessageCallback) {
    this.url = url;
    this.onMessageCallback = onMessageCallback;
    this.ws = null;
    this.reconnectTimeout = null;
    this.isConnected = false;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to real-time data stream');
      this.isConnected = true;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    this.ws.onclose = () => {
      if (this.isConnected) {
        console.log('Disconnected from stream. Reconnecting...');
        this.isConnected = false;
      }
      this.reconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.ws.close();
    };
  }

  reconnect() {
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 5000);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
    }
  }
}
