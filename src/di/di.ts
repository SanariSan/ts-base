type TConstructor<T> = { new (...args: any[]): T };
type TLazy<T> = () => TConstructor<T>;
type TDependency<T> = TLazy<T>;

// todo: add scopes (singleton, request, transient) - https://docs.nestjs.com/fundamentals/injection-scopes
class DIContainer {
  private readonly instances = new Map<
    TConstructor<unknown>,
    { instance?: unknown; dependencies: Array<TDependency<unknown>> }
  >();

  private readonly resolutionStack: Array<TConstructor<unknown>> = [];

  constructor() {
    this.instances = new Map();
  }

  register<T>(constructor: TConstructor<T>, dependencies: Array<TDependency<unknown>>): void {
    this.instances.set(constructor, { dependencies, instance: undefined });
  }

  resolve<T>(constructor: TConstructor<T>): T {
    if (this.resolutionStack.includes(constructor)) {
      const path = [...this.resolutionStack, constructor].map((c) => c.name).join(' -> ');
      throw new Error(`Circular dependency detected: ${path}`);
    }

    const registered = this.instances.get(constructor);
    if (!registered) {
      throw new Error(`No registration for ${constructor.name}`);
    }

    if (registered.instance !== undefined) {
      return registered.instance as T;
    }

    // might need to call earlier to prevent race conditions (or add mutex?)
    this.resolutionStack.push(constructor);
    const resolvedDependencies = registered.dependencies.map((dep) => {
      const DepConstructor = dep();
      return this.resolve(DepConstructor);
    });
    this.resolutionStack.pop();

    const instance = new constructor(...resolvedDependencies);
    registered.instance = instance;

    return instance;
  }
}

const DI = new DIContainer();

export { DI };
