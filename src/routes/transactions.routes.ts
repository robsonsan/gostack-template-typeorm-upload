import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import upĺoadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(upĺoadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  const transactionsResponse = transactions.map(value => {
    return {
      id: value.id,
      title: value.title,
      value: value.value,
      type: value.type,
      category: value.category,
    };
  });

  return response.json({
    transactions: transactionsResponse,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const {
    title,
    value,
    type,
    category,
  }: {
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
  } = request.body;

  const transactionService = new CreateTransactionService();

  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category,
  });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute({ id });

  return response.json(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    try {
      const importTransactionService = new ImportTransactionsService();
      const transactions = await importTransactionService.execute(
        request.file.filename,
      );
      return response.json(transactions);
    } catch (error) {
      return response.status(400).json({ error: 'Erro' });
    }
  },
);

export default transactionsRouter;
