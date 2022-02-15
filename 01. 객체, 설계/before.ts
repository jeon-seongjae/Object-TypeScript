// 이벤트 당첨자에게 발송하는 초대장
// ㄱㅗㅇ연을 관람할 수 있는 초대일자
class bInvitation {
  when: Date;
}

class bTicket {
  fee: number;

  getFee(): number {
    return this.fee;
  }
}

// 소지품을 보관할 가방
class bBag {
  amount: number;
  invitation: bInvitation;
  ticket: bTicket;

  constructor(invitation: bInvitation, ticket?: bTicket) {
    this.invitation = invitation;

    // 이 코드를 위에 밑에 둘 중 하나로 바꾸면 되고 밑에 꺼가 chaning 코드인데 더 좋다
    // 왜냐하면 || 이걸 쓰면 0이나 빈 문자열도 null이 되어버려서 안좋다
    // if (ticket === undefined) {
    //   this.ticket = null;
    // } else {
    //   this.ticket = ticket;
    // }

    this.ticket = ticket || null;
    this.ticket = ticket ?? null;
  }

  hasInvitation(): boolean {
    return this.invitation != null;
  }

  hasTicket(): boolean {
    return this.ticket != null;
  }

  setTicket(ticket: bTicket): void {
    this.ticket = ticket;
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class bAudience {
  bag: bBag;

  constructor(bag: bBag) {
    this.bag = bag;
  }

  getBag(): bBag {
    return this.bag;
  }
}

class bTicketOffice {
  amount: number;
  tickets: Array<bTicket>;

  constructor(amount: number, tickets: Array<bTicket>) {
    this.amount = amount;
    this.tickets.push(...tickets);
  }

  getTicket(): bTicket {
    return this.tickets.pop();
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class bTicketSeller {
  ticketOffice: bTicketOffice;

  constructor(ticketOffice: bTicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  getTicketOffice(): bTicketOffice {
    return this.ticketOffice;
  }
}

/**
 * 모듈의 세가지 목적
 * 1. 실행 중에 제대로 동작하는 것
 * 2. 변경을 위해 존재하는 것
 * 3. 코드를 읽는 사람과 의사소통하는 것
 */
class bTheater {
  ticketSeller: bTicketSeller;
  ticket: bTicket;

  constructor(ticketSeller: bTicketSeller) {
    this.ticketSeller = ticketSeller;
  }

  /**
   * 관람객과 판매원이소극장의 통제를 받는 수동적인 존재라는 것이 문제
   * 그리고 변경에 취약하다 왜냐하면 관람객이 항상 가방을 가진다는 가정을 한 코드라서 가방이 없다는 상황 발생시 수정이 매우 복잡해진다.
   * 이런 문제는 객체 사이의 의존성(dependency)과 관련된 문제를 야기한다. 객체 사이의 의존성이 과한 경우를 가리켜 결합도(coupling)가 높다고 말한다.
   * 우리의 목표는 애플리케이션의 기능을 구현하는 데 필요한 최소한의 의존성만 유지하고 불필요한 의존성을 제거하는 것이다.
   */
  enter(audience: bAudience): void {
    if (audience.getBag().hasInvitation()) {
      this.ticket = this.ticketSeller.getTicketOffice().getTicket();
      audience.getBag().setTicket(this.ticket);
    } else {
      this.ticket = this.ticketSeller.getTicketOffice().getTicket();
      audience.getBag().minusAmount(this.ticket.getFee());
      this.ticketSeller.getTicketOffice().plusAmount(this.ticket.getFee());
      audience.getBag().setTicket(this.ticket);
    }
  }
}
