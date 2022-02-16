class aInvitation {
  when: Date;
}

class aTicket {
  fee: number;

  getFee(): number {
    return this.fee;
  }
}

class aBag {
  amount: number;
  invitation: aInvitation;
  ticket: aTicket;

  constructor(invitation: aInvitation, ticket?: aTicket) {
    this.invitation = invitation;

    this.ticket = ticket || null;
    this.ticket = ticket ?? null;
  }

  hasInvitation(): boolean {
    return this.invitation != null;
  }

  hasTicket(): boolean {
    return this.ticket != null;
  }

  setTicket(ticket: aTicket): void {
    this.ticket = ticket;
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

/**
 * TicketSeller와 동일한 방법으로 Audience의 캡슐화를 개선
 * 수정후 Audience는 자신의 가방 안에 초대장이 들어있는지를 스스로 확인한다.
 */
class aAudience {
  bag: aBag;

  constructor(bag: aBag) {
    this.bag = bag;
  }

  buy(ticket: aTicket): number {
    if (this.bag.hasInvitation()) {
      this.bag.setTicket(ticket);
      return 0;
    } else {
      this.bag.setTicket(ticket);
      this.bag.minusAmount(ticket.getFee());
      return ticket.getFee();
    }
  }
}

class aTicketOffice {
  amount: number;
  tickets: Array<aTicket>;

  ticketOffice(amount: number, tickets: Array<aTicket>) {
    this.amount = amount;
    this.tickets.push(...tickets);
  }

  getTicket(): aTicket {
    return this.tickets.pop();
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

/**
 * 가시성이 private이고 접근 가능한 퍼블릭 메서드가 더 이상 존재하지 않아
 * 외부에서 ticketOffice에 접근 할 수 없도록 getTicketOffice 메소드 제거
 * 결과적으로 ticketOffice에 대한 접근은 오직 TicketSeller 안에만 존재하게 된다 따라서 모든 일은 스스로 수행해야한다.
 * 이렇게 개념적이나 물리적으로 객체 내부의 세부적인 사항을 감추는 것을 캡슐화(encapsulation)라고 부른다
 * 캡슐화의 목적은 변경하기 쉬운 객체를 만드는 것이다.
 */
class aTicketSeller {
  private ticketOffice: aTicketOffice;
  ticket: aTicket;

  constructor(ticketOffice: aTicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  sellTo(audience: aAudience): void {
    this.ticketOffice.plusAmount(audience.buy(this.ticketOffice.getTicket()));
  }
}

/**
 * 수정된 Theater 클래스는 어디서도 ticketOffice에 접근하지 않는다는 사실에 주목하자
 * Theater는 ticketOffice가 TicketSeller 내부에 존재한다는 사실을 모른다
 * 단지 sellTo 메시지를 이해하고 응답할 수 있다는 사실만 알고있다
 * Theater는 오직 TicketSeller의 인터페이스에만 의존한다.
 * 객체를 인터페이스와 구현으로 나누고 인터페이스만을 공개하는 것은 객체 사이의 결합도를 낮추고
 * 변경하기 쉬운 코드를 작성하기 위해 따라야 하는 가장 기본적인 설계이다.
 */

class aTheater {
  ticketSeller: aTicketSeller;
  ticket: aTicket;

  theater(ticketSeller: aTicketSeller) {
    this.ticketSeller = ticketSeller;
  }

  enter(audience: aAudience): void {
    this.ticketSeller.sellTo(audience);
  }
}

/**
 * 결론적으로 Audience나 TicketSeller의 내부 구현을 변경하더라도 Theater를 함께 변경할 필요가 없어졌다.
 * 단지 자기 자신의 문제를 스스로 해결하도록 코드를 변경한 것이다.
 * 핵심은 객체 내부의 상태를 캡슐화하고 객체 간에 오직 메시지를 통해서만 상호작용하도록 만드는 것이다.
 * 밀접하게 연관된 작업만을 수행하고 연관성 없는 작업은 다른 객체에게 위임하는 객체를 가리켜 응집도(cohesion)가 높다고 말한다.
 * 자신의 데이터를 스스로 처리하는 자율적인 객체를 만들면 결합도를 낮출 수 있을뿐더러 응집도를 높일 수 있다.
 * 데이터와 프로세스가 동일한 모듈 내부에 위치하도록 프로그래밍하는 방식을 객체지향 프로그래밍(OOP)라고 부른다.
 * 마지막으로 p26~27핵심이니 읽어보기
 */
