import { Canister, query, text, Record, Principal, bool, StableBTreeMap, Vec, Result,
    Variant, ic, Ok, Err, Some, None, update } from 'azle';
import { v4 as uuidv4 } from "uuid";

/**
 * Define warehouse, user and client's data types
 */
   const Warehouse = Record({
    warehouseId: text,
    userId: Principal,
    warehouseName: text,
    location: text,
    maxColdRoomCapacity: text,
    maxDryRoomCapacity: text,
    listedOnline: bool,
});

const WarehousePayload = Record({
    warehouseName: text,
    location: text,
    maxColdRoomCapacity: text,
    maxDryRoomCapacity: text,
});

const User =Record({
    userId: Principal,
    userName: text,
    userTelNo: text,
    userEmail: text,
});

const UserPayload =Record({
    userName: text,
    userTelNo: text,
    userEmail: text,
});

const Client = Record({
    warehouseId: text,
    clientId: text,
    clientName: text,
    startDate: text,
    endDate: text,
    coldRoomSpaceSizeBooked: text,
    dryRoomSpaceSizeBooked: text,
});

const ClientPayload = Record({
    warehouseId: text,
    clientName: text,
    startDate: text,
    endDate: text,
    coldRoomSpaceSizeBooked: text,
    dryRoomSpaceSizeBooked: text,
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
});


/**
 * Define storage for warehouses, users, and clients details
 */
const warehouseStorage = StableBTreeMap(1, text, Warehouse);
const userStorage = StableBTreeMap(0, Principal, User);
const clientStorage = StableBTreeMap(2, text, Client);

var warehouseCounterId: number = 0;

export default Canister({
    /**
     * Define functions for getting ALL warehouses, ALL users, and ALL clients
     */
    getWarehouses: query([], Vec(Warehouse), () => {
        return warehouseStorage.values();
    }),

    getUsers: query([], Vec(User), () => {
        return userStorage.values();
    }),

    getClients: query([], Vec(Client), () => {
        return clientStorage.values();
    }),


    /**
    * Define functions for getting a SINGLE warehouse, a SINGLE user, and a SINGLE client
    */
    getWarehouse: query([text], Result(Warehouse, Message), (id) => {
        const warehouseOpt = warehouseStorage.get(id);
        if ("None" in warehouseOpt) {
            return Err({ NotFound: `warehouse with id=${id} not found`});
        }
        return Ok(warehouseOpt.Some);
   }),

   getUser: query([text], Result(User, Message), (id) => {
    const userOpt = userStorage.get(id);
    if ("None" in userOpt) {
        return Err({ NotFound: `userwith id=${id} not found`});
    }
    return Ok(userOpt.Some);
    }),

    getClient: query([text], Result(Client, Message), (id) => {
        const clientOpt = clientStorage.get(id);
        if ("None" in clientOpt) {
            return Err({ NotFound: `client with id=${id} not found`});
        }
        return Ok(clientOpt.Some);
   }),

    
   /**
    * Define functions for adding a warehouse, a user, and a client
    */
    addWarehouse: update([WarehousePayload], Result(Warehouse, Message), (payload) => {
        if (Object.keys(payload).length === 0) {
            return Err({InvalidPayload: "invalid warehouse payload"});
        }
        const _warehouseId: text = warehouseCounterId.toString();
        warehouseCounterId += 1;

        const warehouse = {warehouseId: _warehouseId, userId: ic.caller(), listedOnline: true, ...payload };
        warehouseStorage.insert(warehouse.warehouseId, warehouse);
        return Ok(warehouse);
    }),

    addUser: update([UserPayload], Result(User, Message), (payload) => {
        if (Object.keys(payload).length === 0) {
            return Err({InvalidPayload: "invalid user payload"});
        }
        const user = {userId: ic.caller(), ...payload };
        userStorage.insert(user.userId, user);
        return Ok(user);
    }),
    
    addClient: update([ClientPayload], Result(Client, Message), (payload) => {
        if (Object.keys(payload).length === 0) {
            return Err({InvalidPayload: "invalid client payload"});
        }
        const client = {clientId: uuidv4(), ...payload };
        clientStorage.insert(client.warehouseId, client);
        return Ok(client);
    }),


    /**
    * Define functions for updating an existing warehouse, user, and client
    */
    updateWarehouse: update([Warehouse], Result(Warehouse, Message), (payload) => {
        const warehouseOpt = warehouseStorage.get(payload.warehouseId);
        if ("None" in warehouseOpt) {
            return Err({ NotFound: `cannot update the warehouse: warehouse with id=${payload.warehouseId} not found`});
        }
        const updatedWarehouse = {...payload}
        warehouseStorage.insert(warehouseOpt.Some.warehouseId, updatedWarehouse);
        return Ok(updatedWarehouse);
    }),

    updateUser: update([User], Result(User, Message), (payload) => {
        const userOpt = userStorage.get(payload.userId);
        if ("None" in userOpt) {
            return Err({ NotFound: `cannot update the user: user with id=${payload.userId} not found`});
        }
        const updatedUser = {...payload}
        warehouseStorage.insert(userOpt.Some.userId, updatedUser);
        return Ok(updatedUser);
    }),
  
    updateClient: update([Client], Result(Client, Message), (payload) => {
        const clientOpt = clientStorage.get(payload.clientId);
        if ("None" in clientOpt) {
            return Err({NotFound: `cannot update the user: user with id=${payload.clientId} not found`});
        }
        const updatedClient = {...payload}
        warehouseStorage.insert(clientOpt.Some.clientId, updatedClient);
        return Ok(updatedClient);
    }),


    /*
    * Define functions for deleting an existing warehouse, user, and client
    */
    deleteWarehouse: update([text], Result(text, Message), (warehouseId) => {
        const deletedWarehouseOpt = warehouseStorage.remove(warehouseId);
        if ("None" in deletedWarehouseOpt) {
            return Err({NotFound: `cannot delete the warehouse: warehouse with id=${warehouseId} not found`});
        }
        return Ok(deletedWarehouseOpt.Some.warehousId);
    }),

    deleteUser: update([Principal], Result(text, Message), (userId) => {
        const deletedUserOpt = userStorage.remove(userId);
        if ("None" in deletedUserOpt) {
            return Err({NotFound: `cannot delete the user: user with id=${userId} not found`});
        }
        return Ok(deletedUserOpt.Some.userId);
    }),

    deleteClient: update([text], Result(text, Message), (clientId) => {
        const deletedClientOpt = clientStorage.remove(clientId);
        if ("None" in deletedClientOpt) {
            return Err({NotFound: `cannot delete the client: client with id=${clientId} not found`});
        }
        return Ok(deletedClientOpt.Some.clientId);
    }),
    

})

// a work around to make uuid package work with Azle
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
