export interface Options {
  animationSpeed?: number;
  delay?: number;
}

export class DynamicWriting {
  // Base values
  private targetElement: Element | null;
  private wordsArray: string[];
  private options: Options;
  private isReverse: boolean;
  private isRunning: boolean = false;

  // Functional values
  private arrayIterationCount: number = 0;
  private currentWord: Array<string> = [];
  private currentWordLetter: number = 0;
  private writeWordInterval: number = 0;
  private writeWordTimeout: number = 0;
  private clearWordTimeout: number = 0;
  private clearWordInterval: number = 0;

  constructor(
    targetElement: string,
    wordsArray: Array<string>,
    options?: Options
  ) {
    this.targetElement = document.querySelector(targetElement);
    this.wordsArray = wordsArray;
    this.options = {
      animationSpeed: 1,
      delay: 1,
    };
    this.isReverse = wordsArray.length > 1 ? true : false;
    Object.assign(this.options, options);
  }

  public get getTargetElement(): Element | null {
    return this.targetElement;
  }

  public set setTargetElement(target: string) {
    this.targetElement = document.querySelector(target);
  }

  public get getWordsArray(): Array<string> {
    return this.wordsArray;
  }

  public get getAnimationSpeed(): number {
    return this.options.animationSpeed;
  }

  public set setAnimationSpeed(speed: number) {
    this.options.animationSpeed = speed;
  }

  public get getDelay(): number {
    return this.options.delay;
  }

  public set setDelay(delay: number) {
    this.options.delay = delay;
  }

  public get getIsReverse(): boolean {
    return this.isReverse;
  }

  public set setIsReverse(reverse: boolean) {
    this.isReverse = reverse;
  }

  public setCurrentWord() {
    this.currentWord = this.wordsArray[this.arrayIterationCount].split("");
  }

  private deleteLetter() {
    this.targetElement &&
      (this.targetElement.innerHTML = this.targetElement?.innerHTML.slice(
        0,
        this.targetElement.innerHTML.length - 1
      ));
  }

  private clearCurrentWord(): void {
    if (this.isReverse) {
      this.clearWordTimeout = window.setTimeout(() => {
        this.clearWordInterval = window.setInterval(() => {
          if (this.clearWordTimeout) clearTimeout(this.clearWordTimeout);
          if (this.targetElement?.innerHTML != "") this.deleteLetter();
          else {
            clearInterval(this.clearWordInterval);
            this.toggleArrayWords();
          }
        }, (this.options.animationSpeed / this.currentWord.length) * 1000);
      }, this.options.delay * 1000);
    }
  }

  public async toggleArrayWords() {
    if (this.arrayIterationCount < this.wordsArray.length - 1)
      ++this.arrayIterationCount;
    else this.arrayIterationCount = 0;
    this.setCurrentWord();
    this.currentWordLetter = 0;
    this.initializeWordWriting();
  }

  private getLetter() {
    let currentLetter = this.currentWord[this.currentWordLetter] ?? "";
    if (
      this.targetElement?.innerHTML != this.wordsArray[this.arrayIterationCount]
    )
      ++this.currentWordLetter;
    else {
      clearInterval(this.writeWordInterval);
      if (this.isReverse == true) this.clearCurrentWord();
    }
    return currentLetter;
  }

  private initializeWordWriting(): void {
    clearTimeout(this.writeWordTimeout);
    this.writeWordInterval = window.setInterval(() => {
      this.targetElement && (this.targetElement.innerHTML += this.getLetter());
    }, (this.options.animationSpeed / this.currentWord.length) * 1000);
  }

  public init() {
    if (this.isRunning != false) return;
    this.isRunning = true;
    this.setCurrentWord();
    this.initializeWordWriting();
  }
}
