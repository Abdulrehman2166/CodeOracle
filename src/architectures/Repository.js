/**
 * 🏛️ SDA CONCEPT: REPOSITORY PATTERN
 * Mediates between the domain and data mapping layers using a collection-like interface.
 */

class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class UserRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async findById(id) {
        // Complex SQL abstraction
        return new User(id, "John Doe");
    }

    async save(user) {
        console.log(`Persisting user ${user.name} to SQL Database...`);
        return true;
    }
}

export default UserRepository;
