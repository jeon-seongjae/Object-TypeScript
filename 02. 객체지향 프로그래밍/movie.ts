// 진정한 객체지향 패러다임으로의 전환은 클래스가 아닌 객체에 초엄을 맞출 때에만 얻을 수 있다.
// 1. 어떤 클래스가 필요한지 고민하기 전에 어떤 객체들이 필요한지 고민하라.
//   클래스의 윤곽을 잡기 위해서는 어떤 객체들이 어떤 상태와 행동을 가지는지를 먼저 결정하라

// 2. 객체를 독립적인 존재가 아니라 기능을 구현하기 위해 협력하는 공동체의 일원으로 봐야한다.

// 도메인이란? -> 소프트워에는 사용자가 원하는 어떤 문제를 해결하기 위해 만들어진다.
//   영화 예매 시스템의 목적은 영화를 좀 더 쉽고 빠르게 예매하려는 사용자의 문제를 해결하는 것이다.
//   이처럼 문제를 해결하기 위해 사용자가 프로그램을 사용하는 분야를 도메인이라고 부른다.

// 일반적으로 클래스의 이름은 대응되는 도메인 개념의 이름과 동일하거나 적어도 유사하게 지어야 한다.
// 클래스 사이의 관계도 최대한 도메인 개념 사이에 맺어진 관계와 유사하게 만들어서 프로그램의 구조를 이해하고 예상하기 쉽게 만들어야 한다.

// 클래스를 구현하거나 사용할 때 가장 중요한 것은 클래스의 경계를 구분 짓는 것이다.
// 훌륭한 클래스를 설계하기 위한 핵심은 어떤 부분을 외부에 공개하고 어떤 부분을 감출지를 결정하는 것이다.
// 외부에서는 객체의 속성에 직접 접근할 수 없도록 막고 적절한 public 메서드를 통해서만 내부 상태를 변경 할 수 있게 해야한다.

// 클래스의 내부와 외부를 구분해야 하는 이유는 경계의 명확성이 객체의 자율성을 보장하기 때문이고
// 더 중요한 이유로는 프로그래머에게 구현의 자유를 제공하기 때문이다.

// 1. 객체가 상태(state)와 행동(behavior)을 함께 가지는 복합적인 존재라는 것
// 2. 객체가 스스로 판단하고 행동하는 자율적인 존재라는 것

// 대부분 객체지향 프로그래밍 언어들은 외부에서의 접근을 통제할 수 있는 접근 제어(access control) 메커니즘을 제공하고
// 접근 제어를 위해 public, protected, private와 같은 접근 수정자(access modifier)을 제공

class Customer {
  private name: string;
  private id: string;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
  }
}

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

  public reserve(custormer: Customer, audienceCount: number): Reservation {
    return new Reservation(custormer, this, this.calculateFee(audienceCount), audienceCount);
  }

  public calculateFee(audienceCount: number): Money {
    return this.movie.calculateMovieFee(this).times(audienceCount);
  }
}

class Money {
  public ZERO: Money = this.wons(0);
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  wons(amount: number): Money {
    return new Money(amount);
  }

  public plus(amount: Money): Money {
    this.amount += amount.amount;
    return new Money(this.amount);
  }

  public minus(amount: Money): Money {
    this.amount -= amount.amount;
    return new Money(this.amount);
  }

  public times(percent: number): Money {
    this.amount -= (this.amount * percent) / 100;
    return new Money(this.amount / percent);
  }

  public isLessThan(other: Money): boolean {
    if (other.amount > this.amount) {
      return true;
    }
    return false;
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    if (other.amount <= this.amount) {
      return true;
    }
    return false;
  }
}

class Reservation {
  private customer: Customer;
  private screening: Screening;
  private fee: Money;
  private audienceCount: number;

  constructor(customer: Customer, screening: Screening, fee: Money, audienceCount: number) {
    this.customer = customer;
    this.screening = screening;
    this.fee = fee;
    this.audienceCount = audienceCount;
  }
}

class Movie {
  private title: string;
  private runningTime: Date;
  private fee: Money;
  private discountPolicy: DiscountPolicy;

  constructor(title: string, runnigTime: Date, fee: Money, discountPolicy: DiscountPolicy) {
    this.title = title;
    this.runningTime = runnigTime;
    this.fee = fee;
    this.discountPolicy = discountPolicy;
  }

  public getFee(): Money {
    return this.fee;
  }

  public calculateMovieFee(screening: Screening): Money {
    return this.fee.minus(this.discountPolicy.calculateDiscountAmount(screening));
  }
}

interface DiscountPolicy {
  calculateDiscountAmount(screening: Screening): Money;
}

abstract class DefaultDiscountPolicy implements DiscountPolicy {
  private conditions: Array<DiscountCondition> = [];

  constructor(conditions: DiscountCondition) {
    this.conditions = [conditions];
  }

  public calculateDiscountAmount(screening: Screening): Money {
    for (const each of this.conditions) {
      if (each.isSatisfiedBy(screening)) {
        return this.getDiscountAmount(screening);
      }
    }

    return new Money(0).ZERO;
  }

  protected abstract getDiscountAmount(screening: Screening): Money;
}

interface DiscountCondition {
  isSatisfiedBy(screening: Screening): boolean;
}

class sequenceCondition implements DiscountCondition {
  private sequence: number;

  constructor(sequece: number) {
    this.sequence = sequece;
  }

  isSatisfiedBy(screening: Screening): boolean {
    return screening.isSequence(this.sequence);
  }
}

class PeriodCondition implements DiscountCondition {
  private dayOfWeek: string;
  private startTime: string;
  private endTime: string;

  constructor(dayOfWeek: string, startTime: string, endTIme: string) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTIme;
  }

  isSatisfiedBy(screening: Screening): boolean {
    const dayIs: boolean = screening.getStartTime().getDay().toString() === this.dayOfWeek;
    const startIs: boolean = screening.getStartTime().getTime().toString() >= this.startTime ? true : false;
    const endIs: boolean = screening.getStartTime().getTime().toString() <= this.endTime ? true : false;

    if (dayIs && startIs && endIs) {
      return true;
    }
    return false;
  }
}

class AmountDiscountPolicy extends DefaultDiscountPolicy {
  private discountAmount: Money;

  constructor(discountAmount: Money, conditions: DiscountCondition) {
    super(conditions);
    this.discountAmount = discountAmount;
  }

  protected getDiscountAmount(screening: Screening): Money {
    return this.discountAmount;
  }
}

class PercentDiscountPolicy extends DefaultDiscountPolicy {
  private percent: number;

  constructor(percent: number, conditions: DiscountCondition) {
    super(conditions);
    this.percent = percent;
  }

  protected getDiscountAmount(screening: Screening): Money {
    return screening.getMovieFee().times(this.percent);
  }
}

class NoneDiscountPolicy implements DiscountPolicy {
  calculateDiscountAmount(screening: Screening): Money {
    return new Money(0).ZERO;
  }
}
