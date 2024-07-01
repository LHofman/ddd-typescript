export abstract class AggregateRoot<T> {
  constructor(protected readonly props: T) {}
}
