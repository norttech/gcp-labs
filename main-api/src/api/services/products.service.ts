import L from '../../common/logger';
import CustomError from '../../common/utils/customError';

interface Product {
    id: number;
    name: string;
    branchId: number;
}

export class ProductsService {
    private products: Product[];
    private internalId = 0;
    constructor() {
        this.products = [
            { id: ++this.internalId, name: 'Product 1', branchId: 3 },
            { id: ++this.internalId, name: 'Product 2', branchId: 2 },
        ];
    }

    create(name: string): Promise<Product> {
        L.info(`create Product with name ${name}`);
        const product: Product = { id: ++this.internalId, name, branchId: 2 };
        this.products.push(product);
        return Promise.resolve(product);
    }

    findAll(): Promise<Product[]> {
        L.info(this.products, 'fetch all Products');
        return Promise.resolve(this.products);
    }

    findById(id: number) {
        L.info(`fetch Product with id ${id}`);
        const element = this.products.find((x) => x.id == id);
        if (!element) throw new CustomError('Product not found');
        return Promise.resolve(element);
    }

    async update(id: number, data: Product) {
        await this.findById(id);
        const index = this.products.findIndex((x) => x.id == id);
        this.products[index].name = data.name;
        return this.products[index];
    }

    async delete(id: number) {
        await this.findById(id);
        this.products = this.products.filter((x) => x.id != id);
        return Promise.resolve({ status: 'deleted' });
    }
}

export default new ProductsService();
