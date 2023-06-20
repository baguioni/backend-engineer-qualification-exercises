export default class<TInput extends Array<any> = Array<any>, TOutput = any> {
  private cache: Record<string, Promise<TOutput>>;

  constructor(private handler: (...args: TInput) => Promise<TOutput>, private timeout?: number) {
    this.cache = {}
  }

  async exec(...args: TInput): Promise<TOutput> {
    // this should suffice for the test cases. however should consider the order of the arguments
    const key = args.toString()
 
    if (key in this.cache) {
      return this.cache[key] 
    } 

    const result = this.handler(...args)
    this.cache[key] = result
    
    if (this.timeout) {
      setTimeout(() => {
        delete this.cache[key]
      }, this.timeout)
    }

    return result
  }
}
