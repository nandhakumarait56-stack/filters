import {
  Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, Get, Param, Put, Delete, BadRequestException, Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ALLOWED_FILE_TYPES } from '../constants/message';
import { JwtUser } from 'src/auth/auth.service';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `product-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any, 
  ) {
    const fileUrls = files.map(file => `http://localhost:3000/uploads/products/${file.filename}`);
    return this.productService.create(
      createProductDto,
      req.user.userId,
      req.user.username,
      fileUrls
    );
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }
@Get('filter')
async filterProducts(@Query() filters: FilterProductDto) {
  return this.productService.filterProducts(filters);
}

@Get(':id')
async findOne(@Param('id') id: string) {
  return this.productService.findOne(id);
}


    @UseGuards(JwtAuthGuard)
@Put(':id')
@UseInterceptors(
  FilesInterceptor('image', 5, {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (_, file, cb) => {
      if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new BadRequestException('Unsupported file type'), false);
      }
      cb(null, true);
    },
  }),
)
async update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
  @UploadedFiles() files: Express.Multer.File[],
  @Req() req: { user: JwtUser },
) {
  const newFileUrls = files
    ? files.map(file => `http://localhost:3000/uploads/products/${file.filename}`)
    : [];

  const userId = req.user?.userId;
  const username = req.user?.username;

  return this.productService.update(id, updateProductDto, newFileUrls, userId, username);
}



  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  




}
