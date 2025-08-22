import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_MESSAGES } from '../constants/message';
import { isFunction } from 'rxjs/internal/util/isFunction';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(dto: CreateProductDto, userId: string, username: string, images: string[]) {
    try {
      const product = new this.productModel({
        ...dto,
        userId,
        username,
        images,
      });
      await product.save();
      return { message: PRODUCT_MESSAGES.CREATE_SUCCESS, product };
    } catch (error) {
      throw new BadRequestException(error.message || PRODUCT_MESSAGES.CREATE_ERROR);
    }
  }

  async findAll() {
    return this.productModel.find().exec();
  }
  
  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND(id));
    return product;
  }

async update(id: string, dto: UpdateProductDto, images: string[], userId: string, username: string) {
  try {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND(id));

    const updateData: Partial<Product> = { ...dto };
    if (images && images.length > 0) {
      updateData.images = [...(product.images || []), ...images];
    }

    if (product.userId.toString() !== userId) {
      updateData.userId = userId;
      updateData.username = username;
    }

    const updated = await this.productModel.findByIdAndUpdate(id, updateData, { new: true });

    return { message: PRODUCT_MESSAGES.UPDATE_SUCCESS, product: updated };
  } catch (error) {
    throw new BadRequestException(error.message || PRODUCT_MESSAGES.UPDATE_ERROR);
  }
}


  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND(id));
    return { message: PRODUCT_MESSAGES.DELETE_SUCCESS(product.name) };
  }


async filterProducts(filters: FilterProductDto): Promise<Product[]> {
  const query: Record<string, unknown> = {};
  if (filters.name) {
    query.name = { $regex: filters.name.trim(), $options: 'i' };
  }
  if (filters.startDate || filters.endDate) {
    const createdAt: any = {};

    if (filters.startDate && typeof filters.startDate === 'string') {
      createdAt.$gte = new Date(filters.startDate);
    }

    if (filters.endDate && typeof filters.endDate === 'string') {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); 
      createdAt.$lte = end;
    }

    query.createdAt = createdAt;
  }

  if (filters.stockAvailable !== undefined) {
    const stockAvailable = filters.stockAvailable === 'true';
    query.stock = stockAvailable ? { $gt: 0 } : 0;
  }

  return this.productModel.find(query).exec();
}




}
