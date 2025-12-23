import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        gallery: createProductDto.gallery as any,
        colors: createProductDto.colors as any,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subCategory: true,
        brand: true,
        unit: true,
        weight: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findAllActive() {
    return this.prisma.product.findMany({
      where: {
        status: 'active',
      },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        unit: true,
        weight: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        unit: true,
        weight: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, createdAt, updatedAt, ...rest } = updateProductDto as any;

    // Extract relation id fields to convert into nested writes
    const { categoryId, subCategoryId, brandId, unitId, weightId, ...other } =
      rest;

    const data: any = {
      ...other,
      gallery: other.gallery as any,
      colors: other.colors as any,
    };

    // Convert scalar foreign keys into nested relation updates as required by Prisma
    if (categoryId !== undefined) {
      // category is required in the schema - connect to the provided id
      data.category = { connect: { id: Number(categoryId) } };
    }

    if (subCategoryId !== undefined) {
      if (subCategoryId === null) {
        data.subCategory = { disconnect: true };
      } else {
        data.subCategory = { connect: { id: Number(subCategoryId) } };
      }
    }

    if (brandId !== undefined) {
      if (brandId === null) {
        data.brand = { disconnect: true };
      } else {
        data.brand = { connect: { id: Number(brandId) } };
      }
    }

    if (unitId !== undefined) {
      if (unitId === null) {
        data.unit = { disconnect: true };
      } else {
        data.unit = { connect: { id: Number(unitId) } };
      }
    }

    if (weightId !== undefined) {
      if (weightId === null) {
        data.weight = { disconnect: true };
      } else {
        data.weight = { connect: { id: Number(weightId) } };
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  updateBundleOffers(id: number, bundleOffers: any[]) {
    return this.prisma.product.update({
      where: { id },
      data: { bundleOffers },
    });
  }

  async calculatePrice(id: number, selectedColors: string[]) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const colorCount = selectedColors.length;
    const bundleOffer = (product.bundleOffers as any[])?.find(
      (offer) => offer.colorCount === colorCount,
    );

    const price = bundleOffer ? bundleOffer.price : product.basePrice;

    return {
      colorCount,
      price,
      selectedColors,
      availableColors: product.colors,
    };
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      include: { category: true, subCategory: true, brand: true },
      take: 10,
    });

    return products.map((product) => {
      const firstColor = product.colors[0] as any;
      const firstSize = firstColor?.sizes?.[0];
      const firstGallery = product.gallery[0] as any;
      return {
        id: product.id,
        name: product.name,
        price: firstSize?.price || product.basePrice,
        image: firstColor?.image || firstGallery?.url,
      };
    });
  }
}
