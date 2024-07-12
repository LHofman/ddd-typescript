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

  public static fail(errors: string | string[]) {
    if (!Array.isArray(errors)) errors = [errors];

    return new Result(true, null, errors);
  }

  public getValue(): T {
    return this.value;
  }

  public getErrors(): Maybe<string[]> {
    return this.errors;
  }

  public static combine(...results: Result<unknown>[]) {
    if (!results.some((result) => result.isFailure)) {
      return Result.ok();
    }

    const errors = results.reduce((acc, result) => {
      if (result.isFailure) {
        return acc.concat(result.getErrors());
      }

      return acc;
    }, []);

    return Result.fail(errors);
  }

  public onSuccess<T2>(callback: (result?: T) => Result<T2>): Result<T2> {
    if (this.isFailure) {
      return Result.fail(this.errors);
    }

    return callback(this.value);
  }

  public onSuccessAsync<T2>(callback: (result?: T) => Promise<Result<T2>>): Promise<Result<T2>> {
    if (this.isFailure) {
      return Promise.resolve(Result.fail(this.errors));
    }

    return callback(this.value);
  }
}
