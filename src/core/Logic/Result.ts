import { Maybe } from '../../types';

export class Result<T> {
  private constructor(
    public readonly isFailure: boolean,
    private readonly value: Maybe<T>,
    private readonly errors: Maybe<string[]>
  ) {}

  public static ok<T>(value?: T) {
    return new Result<T>(false, value, null);
  }

  public static fail<T>(errors: string | string[]) {
    if (!Array.isArray(errors)) errors = [errors];

    return new Result<T>(true, null, errors);
  }

  public getValue(): T {
    return this.value;
  }

  public getErrors(): Maybe<string[]> {
    return this.errors;
  }
}
