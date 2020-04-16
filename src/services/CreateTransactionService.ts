import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO

    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();
      if (balance.total < value) {
        throw new AppError(
          'Não é possivel retirar valor maior do que o saldo disponivel',
          400,
        );
      }
    }

    let findCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!findCategory) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      findCategory = newCategory;
    }

    let transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: findCategory.id,
    });

    transaction = await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
