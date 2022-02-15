// 이벤트 당첨자에게 발송하는 초대장
// ㄱㅗㅇ연을 관람할 수 있는 초대일자
class Invitation {
  when: Date;
}

class Ticket {
  fee: number;

  getFee(): number {
    return this.fee;
  }
}

class Bag {
  amount: number;
  invitation: Invitation;
  ticket: Ticket;

  constructor(invitation: Invitation, ticket?: Ticket) {
    this.invitation = invitation;

    this.ticket = ticket || null;
    this.ticket = ticket ?? null;

    // if (ticket === undefined) {
    //   this.ticket = null;
    // } else {
    //   this.ticket = ticket;
    // }
  }

  hasInvitation(): boolean {
    return this.invitation != null;
  }

  hasTicket(): boolean {
    return this.ticket != null;
  }

  setTicket(ticket: Ticket): void {
    this.ticket = ticket;
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class Audience {
  bag: Bag;

  constructor(bag: Bag) {
    this.bag = bag;
  }

  getBag(): Bag {
    return this.bag;
  }
}

class TicketOffice {
  amount: number;
  tickets: Array<Ticket>;

  ticketOffice(amount: number, tickets: Array<Ticket>) {
    this.amount = amount;
    this.tickets.push(...tickets);
  }

  getTicket(): Ticket {
    return this.tickets.pop();
  }

  minusAmount(amount: number): void {
    this.amount -= amount;
  }

  plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class TicketSeller {
  ticketOffice: TicketOffice;

  ticketSeller(ticketOffice: TicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  getTicketOffice(): TicketOffice {
    return this.ticketOffice;
  }
}

class Theater {
  ticketSeller: TicketSeller;
  ticket: Ticket;

  theater(ticketSeller: TicketSeller) {
    this.ticketSeller = ticketSeller;
  }

  enter(audience: Audience): void {
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
