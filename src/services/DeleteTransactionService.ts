// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const deletedtransaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!deletedtransaction) {
      throw new AppError('Transction with this id not founded');
    }

    await transactionsRepository.remove(deletedtransaction);
  }
}

export default DeleteTransactionService;
