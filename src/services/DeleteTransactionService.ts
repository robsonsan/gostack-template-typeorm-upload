import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToBeDeleted = await transactionsRepository.findOne({
      where: {
        id,
      },
    });

    if (!transactionToBeDeleted) {
      throw new AppError('Transaction not found', 400);
    }

    try {
      await transactionsRepository.remove(transactionToBeDeleted);
    } catch (error) {
      throw new AppError('Unknown error', 500);
    }
  }
}

export default DeleteTransactionService;
