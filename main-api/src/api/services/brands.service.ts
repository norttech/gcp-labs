import L from '../../common/logger';
import CustomError from '../../common/utils/customError';

interface Brand {
    id: number;
    name: string;
}

export class BrandsService {
    private brands: Brand[];
    private internalId = 0;
    constructor() {
        this.brands = [
            { id: ++this.internalId, name: 'Brand 1' },
            { id: ++this.internalId, name: 'Brand 2' },
        ];
    }

    create(name: string): Promise<Brand> {
        L.info(`create Brand with name ${name}`);
        const brand: Brand = { id: ++this.internalId, name };
        this.brands.push(brand);
        return Promise.resolve(brand);
    }

    findAll(): Promise<Brand[]> {
        L.info(this.brands, 'fetch all brands');
        return Promise.resolve(this.brands);
    }

    findById(id: number) {
        L.info(`fetch Brand with id ${id}`);
        const element = this.brands.find((x) => x.id == id);
        if (!element) throw new CustomError('Brand not found');
        return Promise.resolve(element);
    }

    async update(id: number, data: Brand) {
        await this.findById(id);
        const index = this.brands.findIndex((x) => x.id == id);
        this.brands[index].name = data.name;
        return this.brands[index];
    }

    async delete(id: number) {
        await this.findById(id);
        this.brands = this.brands.filter((x) => x.id != id);
        return Promise.resolve({ status: 'deleted' });
    }
}

export default new BrandsService();
