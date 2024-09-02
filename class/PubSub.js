export class PubSub {
  constructor() {
    this.subscribers = {};
  }

  // Suscribir un manejador a un tema
  subscribe(topic, handler) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(handler);
  }

  // Publicar un mensaje en un tema
  publish(topic, message) {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach((handler) => handler(message));
    }
  }

  // Desuscribir un manejador de un tema
  unsubscribe(topic, handler) {
    if (this.subscribers[topic]) {
      this.subscribers[topic] = this.subscribers[topic].filter(
        (h) => h !== handler
      );
    }
  }
}
