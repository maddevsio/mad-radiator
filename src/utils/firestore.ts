import axios from "axios";
import dotenv from 'dotenv';

// eslint-disable-next-line jest/require-hook
dotenv.config();

export class Firestore {
    private firestoreId: string | undefined = process.env.FIRESTORE_ID

    private url: string = `https://firestore.googleapis.com/v1/projects/${this.firestoreId}/databases/(default)/documents`

    private queryUrl: string = `https://firestore.googleapis.com/v1/projects/${this.firestoreId}/databases/(default)/documents:runQuery`

    public async getData(documentName: string) {
        return axios.get(`${this.url}/${documentName}`)
    }

    public async setData(documentName: string, fields: object) {
        return axios.post(`${this.url}/${documentName}`, fields)
    }

    public async getDataAfterDate(date: string, limit?: number, collectionId: string = 'blog') {
        return axios.post(this.queryUrl,
            {
                structuredQuery:
                    {
                        from: [
                            {
                                collectionId
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
