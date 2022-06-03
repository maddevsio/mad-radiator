import axios from "axios";
import dotenv from 'dotenv';

// eslint-disable-next-line jest/require-hook
dotenv.config();

export class Firestore {
    private firestoreId: string | undefined = process.env.FIRESTORE_ID

    private url: string = `https://firestore.googleapis.com/v1/projects/${this.firestoreId}/databases/(default)/documents`

    public async getData(documentName: string) {
        return axios.get(`${this.url}/${documentName}`)
    }

    public async setData(documentName: string, fields: object) {
        try {
            return await axios.post(`${this.url}/${documentName}`, fields)
        } catch (error: any) {
            throw new Error(error)
        }
    }
}