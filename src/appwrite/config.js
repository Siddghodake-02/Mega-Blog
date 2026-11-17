

import conf from "../conf/conf.js";
import { Client, ID, Storage, Query, TablesDB } from "appwrite";

export class Service {
    client = new Client();
    TablesDB;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.TablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create Post
    async createPost({ title, slug, content,  featuredimage, status, userid }) {
        try {
            return await this.TablesDB.createRow(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                }
            );
        } catch (error) {
            console.log("Appwrite Service :: createPost :: error", error);
            throw error;
        }
    }

    // Update Post
    async updatePost(slug, { title, content,  featuredimage, status }) {
        try {
            return await this.TablesDB.updateRow(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite Service :: updatePost :: error", error);
            throw error;
        }
    }

    // Delete Post
    async deletePost(slug) {
        try {
            await this.TablesDB.deleteRow(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

            return true;
        } catch (error) {
            console.log("Appwrite Service :: deletePost :: error", error);
            return false;
        }
    }

    // Get Single Post
    async getPost(slug) {
        try {
            return await this.TablesDB.getRow(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error", error);
            return false;
        }
    }

    // Get All Posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.TablesDB.listRows(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                100,
                0
            );
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error", error);
            return false;
        }
    }

    // Upload File
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: error", error);
            return false;
        }
    }

    // Delete File
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );

            return true;
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
  return this.bucket.getFileView({
    bucketId: conf.appwriteBucketId,
    fileId,
  });
}
}

const service = new Service();

export default service;
