export class State extends EventTarget {
  constructor() {
    super();
    this.state = {};
  }

  store(key, value) {
    if (typeof value === "function") {
      value = value(this.state[key]);
    }
    this.state[key] = value;
    this.dispatchEvent(new CustomEvent(key, { detail: value }));
  }

  load(key) {
    return this.state[key];
  }

  on(kv) {
    for (const [key, value] of Object.entries(kv)) {
      this.addEventListener(key, value);
    }
  }
}
