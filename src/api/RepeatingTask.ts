export default class RepeatingTask {

  private readonly intervalId: NodeJS.Timeout;

  public constructor(delay: number, action: () => void) {
    this.intervalId = setInterval(() => action(), 1000 * delay);
  }

  public cancel(): void {
    clearInterval(this.intervalId);
  }
}