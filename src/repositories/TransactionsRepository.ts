import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const balance: Balance = { income: 0, outcome: 0, total: 0 };
    const transactions = await this.find();

    balance.income = transactions
      .filter(transaction => transaction.type === 'income')
      .map(transaction => parseFloat(`${transaction.value}`))
      .reduce((previous, current) => previous + current, 0.0);

    balance.outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transaction => parseFloat(`${transaction.value}`))
      .reduce((previous, current) => previous + current, 0.0);

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
