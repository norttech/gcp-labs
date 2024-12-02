import { FirestoreClient } from '@google-cloud/firestore/types/v1/firestore_client';
import L from '../../common/logger';
import CustomError from '../../common/utils/customError';
import { CollectionReference, Firestore } from '@google-cloud/firestore';
import { randomUUID } from 'crypto';

interface Brand {
    id: string;
    name: string;
}

export class BrandsService {
    private readonly collectionRef: CollectionReference<Brand>;

    constructor() {
        const collectionName = process.env['FIRESTORE_COLLECTION']!;
        this.collectionRef = new Firestore().collection(collectionName) as CollectionReference<Brand>;
    }

    async create(name: string): Promise<Brand> {
        L.info(`create Brand with name ${name}`);
        const id = randomUUID();
        const brand: Brand = { id, name };
        await this.collectionRef.doc(id).set(brand);
        return brand;
    }

    async findAll(): Promise<Brand[]> {
        L.info('fetch all brands');
        return (await this.collectionRef.limit(10).get()).docs.map((x) => x.data());
    }

    async findById(id: string) {
        L.info(`fetch Brand with id ${id}`);
        const element = await this.collectionRef.doc(id).get();
        if (!element.exists) throw new CustomError('Brand not found');
        return element.data();
    }

    async update(id: string, data: Brand) {
        const brand = await this.findById(id);
        await this.collectionRef.doc(id).update({ ...data });
        return { ...brand, ...data };
    }

    async delete(id: string) {
        await this.findById(id);
        await this.collectionRef.doc(id).delete({ exists: true });
        return Promise.resolve({ status: 'deleted' });
    }
}

export default new BrandsService();
