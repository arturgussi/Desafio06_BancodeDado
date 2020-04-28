import csvPaser from 'csv-parse';
import fs from 'fs';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface RequestDTO {
  CSVFilePath: string;
}

class ImportTransactionsService {
  async execute({ CSVFilePath }: RequestDTO): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(CSVFilePath);

    const parseStream = csvPaser({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const title = line[0];
      const type = line[1];
      const stringValue = line[2];
      const category = line[3];

      const value = parseFloat(stringValue);

      const createTransaction = new CreateTransactionService();

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransaction.execute({
        title,
        type,
        value,
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
