// cannister code goes here
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, bool } from 'azle';
import { v4 as uuidv4 } from 'uuid';

/**
 * This type represents a warehouse real estate property that can be listed online for advertisement 
 */


/**
 * Define warehouse, user and client's data types
 */
type Warehouse = Record<{
    id: string;
    name: string;
    location: string;
    maxColdRoomCapacity: nat64;
    maxDryRoomCapacity: nat64;
    listedOnline: bool;
}>

type WarehousePayload = Record<{
    name: string;
    location: string;
    maxColdRoomCapacity: nat64;
    maxDryRoomCapacity: nat64;
}>

type User = Record<{
    id: string;
    name: string;
    userTelNo: string;
    userEmail: string;

}>

type Client = Record<{
    id: string;
    name: string;
    bookingDate: string;
    bookedCapacity: nat64;
}>


/**
 * Define storage for warehouses, users, and clients details
 */
const warehouseStorage = new StableBTreeMap<string, Warehouse>(0, 44, 1024);
const userStorage = new StableBTreeMap<string, User>(0, 44, 1024);
const clientStorage = new StableBTreeMap<string, Client>(0, 44, 1024);


/**
 * Define functions for getting ALL warehouses, users, and clients
 */
$query;
export function getWarehouse(id: string): Result<Vec<Warehouse>, string> {
    return match(warehouseStorage.get(id), {
        Some: (warehouse) => Result.Ok<Vec<Warehouse>, string>(warehouse),
        None: () => Result.Err<Vec<Warehouse>, string>(`a warehouse with id=${id} not found`),
    });
}

$query;
export function getUser(id: string): Result<Vec<User>, string> {
    return match(userStorage.get(id), {
        Some: (user) => Result.Ok<Vec<User>, string>(user),
        None: () => Result.Err<Vec<User>, string>(`a user with id=${id} not found`),
    });
}

$query;
export function getClient(id: string): Result<Vec<Client>, string> {
    return match(clientStorage.get(id), {
        Some: (client) => Result.Ok<Vec<Client>, string>(client),
        None: () => Result.Err<Vec<Client>, string>(`a client with id=${id} not found`),
    });
}


/**
 * Define functions for getting a SINGLE warehouse, user, and client
 */
$query;
export function getWarehouse(id: string): Result<Vec<Warehouse, string>{
    return match(warehouseStorage.get(id), {
        Some: (warehouse) => Result.Ok(<Warehouse, String>(warehouse)),
        None: () => Result.Err(<Warehouse, String>('a warehouse with id=${id} not found')),
    });

$query;
export function getUser(id: string): Result<Vec<User, string>{
    return match(userStorage.get(id), {
        Some: (user => Result.Ok(<Warehouse, String>(user)),
        None: () => Result.Err(<User, String>('a user with id=${id} not found')),
    });

$query;
export function getClient(id: string): Result<Vec<Client, string>{
    return match(clientStorage.get(id), {
        Some: (client) => Result.Ok(<Warehouse, String>(client)),
        None: () => Result.Err(<Client, String>('a client with id=${id} not found')),
    });


/**
 * Define functions for adding a warehouse, a user, and a client
 */
$update;
export function addWarehouse(payload: WarehousePayload): Result<Warehouse, string> {
    const warehouse: Warehouse = { id: uuidv4(), listedOnline: true, ...payload };
    warehouseStorage.insert(warehouse.id, warehouse);
    return Result.Ok<Warehouse, string>(warehouse);
}

$update;
export function addUser(name: string, userTelNo: string, userEmail: string): Result<User, string> {
    const user: User = { id: uuidv4(), name: name, userTelNo: userTelNo, userEmail: userEmail };
    userStorage.insert(user.id, user);
    return Result.Ok<User, string>(user);
}


$update;

export function addClient(name: string, bookingDate: string, bookedCapacity: nat64): Result<Client, string> {
    const client: Client = { id: uuidv4(), name: name, bookingDate: bookingDate, bookedCapacity: bookedCapacity };
    clientStorage.insert(client.id, client);
    return Result.Ok<Client, string>(client);
}

/**
 * Define functions for updating an existing warehouse, user, and client
 */
$update;
export function updateWarehouse(id: String, payload: WarehousePayload): Result<Warehouse, String>{
    return match(warehouseStorage.get(id), {
        Some: (warehouse) => {
            const updatedWarehouse : Warehouse ={...warehouse, ...payload};
            warehouseStorage.insert(warehouse.id, updatedWarehouse);
            return Result.Ok<Warehouse, String>(updatedWarehouse);
        },
        None: () => Result.Err<Warehouse, String>(`Couldn't update a warehouse with id = ${id}. Warehouse not found`)
        }
    }


$update;
export function updateUser(id: String, name: String, userTelNo: String, userEmail: String): Result<User, String>{
    return match(userStorage.get(id), {
        Some: (user) => {
            const updatedUser: User ={...user, name: String, userTelNo: String, userEmail: String};
            userStorage.insert(user.id, updatedUser);
            return Result.Ok<User, String>(updatedUser);
        },
        None: () => Result.Err<User, String>(`Couldn't update a user with id = ${id}. User not found`);
    }

$update;
export function updateClient(id: String, name: string, bookingDate: string, bookedCapacity: nat64 ): Result<Client, String>{
    return match(clientStorage.get(id), {
        Some: (client) => {
            const updatedClient : Client ={...client, ...payload};
            clientStorage.insert(client.id, updatedClient);
            return Result.Ok<Client, String>(updatedClient);
        },
        None: () => Result.Err<Client, String>(`Couldn't update a client with id = ${id}. Client not found`);
    }

/*
 * Define functions for deleting an existing warehouse, user, and client
 */
$update;
export function deleteWarehouse(id: String): Result<Warehouse, String>{
    return match(warehouseStorage.remove(id), {
        Some: (deletedWarehouse) => Result.Ok<Warehouse, String>(deletedWarehouse);
        None: () => Result.Err<Warehouse, String>(`Couldn't delete a warehouse with id = ${id}. Warehouse not found`);
    });
     
    }

$update;
export function deleteUser(id: String): Result<User, String>{
    return match(userStorage.remove(id), {
        Some: (deletedUser) => Result.Ok<User, String>(deletedUser);
        None: () => Result.Err<User, String>(`Couldn't delete a user with id = ${id}. User not found`);
    });
        
    }

$update;
export function deleteClient(id: String): Result<Client, String>{
    return match(clientStorage.remove(id), {
        Some: (deletedClient) => Result.Ok<Client, String>(deletedClient);
        None: () => Result.Err<Client, String>(`Couldn't delete a client with id = ${id}. Client not found`);
    });
        
    }
// a workaround to make uuid package work with Azle
globalThis.crypto = {
    //@ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32)

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random()* 256)
        }

        return array
    }
}

}
