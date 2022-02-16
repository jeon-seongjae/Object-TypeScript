class Screening {
  private movie: Movie;
  private sequence: number;
  private whenScreened: Date;

  constructor(movie: Movie, sequence: number, whenScreend: Date) {
    this.movie = movie;
    this.sequence = sequence;
    this.whenScreened = whenScreend;
  }

  public getStartTime(): Date {
    return this.whenScreened;
  }

  public isSequence(sequence: number): boolean {
    return this.sequence === sequence;
  }

  public getMovieFee() {
    return this.movie.getFee();
  }
}
