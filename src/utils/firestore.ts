import axios from "axios";
import dotenv from 'dotenv';

// eslint-disable-next-line jest/require-hook
dotenv.config();

export class Firestore {
    private url: string

    private queryUrl: string

    constructor(firestoreId: string) {
        this.url = `https://firestore.googleapis.com/v1/projects/${firestoreId}/databases/(default)/documents`
        this.queryUrl = `https://firestore.googleapis.com/v1/projects/${firestoreId}/databases/(default)/documents:runQuery`
    }

    public async getData(documentName: string) {
        return axios.get(`${this.url}/${documentName}`)
    }

    public async setData(documentName: string, fields: object) {
        return axios.post(`${this.url}/${documentName}`, fields)
    }

    public async getDataAfterDate(date: string, dir: string, limit?: number) {
        return axios.post(this.queryUrl,
            {
                structuredQuery:
                {
                    from: [
                        {
                            collectionId: dir
                        }
                    ],
                    where: {
                        fieldFilter: {
                            field: {
                                fieldPath: 'created'
                            },
                            op: 'GREATER_THAN_OR_EQUAL',
                            value: {
                                timestampValue: date
                            }
                        }
                    },
                    limit,
                }
            })
    }
}
