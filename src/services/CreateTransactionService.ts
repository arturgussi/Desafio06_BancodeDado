import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // verificação se está correto o tipo da transação
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type description is not aceptable');
    }

    // verificação se o valor do outcome não passa o total em caixa
    if (type === 'outcome') {
      const transactionRepository = new TransactionsRepository();

      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Value of outcome is bigger than your balance');
      }
    }

    const newCategory = new CreateCategoryService();

    const category_id = await newCategory.execute({ category });

    const transctionsRepository = getRepository(Transaction);

    const transaction = transctionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transctionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
