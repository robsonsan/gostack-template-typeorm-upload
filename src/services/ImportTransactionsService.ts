import path from 'path';
import Papa from 'papaparse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Tr {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: any): Promise<Transaction[]> {
    // TODO
    const createTransactionService = new CreateTransactionService();
    const transactions: Transaction[] = [];
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const content = fs.readFileSync(csvFilePath, 'utf-8');
    const results = await Papa.parse(content, {
      delimiter: ', ',
      header: true,
    });
    const resposta = results.data;
    resposta.pop();
    for (let i = 0; i < resposta.length; i++) {
      const tr: Tr = resposta[i];
      // eslint-disable-next-line no-await-in-loop
      const resp = await createTransactionService.execute(tr);
      transactions.push(resp);
    }
    return transactions;
  }
}

export default ImportTransactionsService;
