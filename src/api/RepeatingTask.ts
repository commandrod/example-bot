export default class RepeatingTask {

  private readonly delay: number;
  private intervalId: NodeJS.Timeout;

  public constructor(delay: number, action: () => void) {
    this.delay = delay;
    this.intervalId = setInterval(() => {
      action();
    }, 1000 * this.delay);
  }

  public cancel(): void {
    clearInterval(this.intervalId);
  }
}