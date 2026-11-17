import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name,
        });

            if (userAccount) {
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession({
                email,
                password,
            });
        } catch (error) {
            throw error;
        }
    }

    // async getCurrentUser() {
    //     try {
    //         return await this.account.get();
    //     } catch (error) {
    //         console.log("Appwrite Service :: getCurrentUser :: error", error);
    //     }
    //     return null;
    // }

   async getCurrentUser() {
    try {
        const user = await this.account.get();
        return user;
    } catch (error) {
        if (error.code === 401) {
            return null;
        }

        console.error("getCurrentUser error:", error);
        return null;
    }
}

    async logout() {                       // fixed spelling
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite Service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();
export default authService;