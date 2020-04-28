import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface RequestDTO {
  category: string;
}

class CreateCategoryService {
  public async execute({ category }: RequestDTO): Promise<string> {
    const categoryRepository = getRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      return newCategory.id;
    }

    return checkCategoryExists.id;
  }
}

export default CreateCategoryService;
