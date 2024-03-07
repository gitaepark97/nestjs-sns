export class Builder<T extends object> {
  constructor(
    private readonly cls: { new (): T },
    private readonly property: Partial<T> = {},
  ) {}

  set<K extends keyof T>(key: K, value: T[K]) {
    this.property[key] = value;
    return this;
  }

  build() {
    return Object.assign(new this.cls(), this.property);
  }
}
