import { BigQuery } from '@google-cloud/bigquery';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Product;
    }

    afterInsert(event: InsertEvent<Product>) {
        const bigQuery = new BigQuery({
            keyFilename: process.env.BIGQUERY_KEY_FILENAME,
            projectId: process.env.BIGQUERY_PROJECT_ID,
        });

        bigQuery
            .dataset(process.env.GCP_BIGQUERY_DATASET)
            .table(process.env.GCP_BIGQUERY_TABLE)
            .insert([
                {
                    id: event.entity.id,
                    name: event.entity.name,
                    description: event.entity.descriptions,
                    price: event.entity.price,
                },
            ]);
    }
}
