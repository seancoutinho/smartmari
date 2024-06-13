"use server";
import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Creates an admin client for interacting with Appwrite services.
 * This client is authenticated using a project API key.
 *
 * @returns An object containing the account, database, and users services.
 * @throws Will throw an error if any of the required environment variables are missing.
 */
export async function createAdminClient() {
  // Initialize the Appwrite client with the provided endpoint, project ID, and API key
  const client = new Client()
   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
   .setKey(process.env.NEXT_APPWRITE_KEY!);

  // Return an object containing the account, database, and users services
  return {
    /**
     * Returns an instance of the Account service.
     * This service allows you to manage user accounts, including creating, updating, and deleting users.
     */
    get account() {
      return new Account(client);
    },

    /**
     * Returns an instance of the Databases service.
     * This service allows you to manage collections, documents, and indexes in your Appwrite database.
     */
    get database() {
      return new Databases(client);
    },

    /**
     * Returns an instance of the Users service.
     * This service allows you to manage user accounts, including creating, updating, and deleting users.
     */
    get users() {
      return new Users(client);
    },
  };
}
