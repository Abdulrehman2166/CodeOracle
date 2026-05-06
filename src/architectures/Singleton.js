/**
 * 🏛️ SDA CONCEPT: SINGLETON PATTERN
 * Ensures a class has only one instance and provides a global point of access.
 */

class SystemCore {
    static instance = null;

    constructor() {
        if (SystemCore.instance) {
            return SystemCore.instance;
        }
        this.startTime = Date.now();
        SystemCore.instance = this;
    }

    static getInstance() {
        if (!SystemCore.instance) {
            SystemCore.instance = new SystemCore();
        }
        return SystemCore.instance;
    }

    getSystemUptime() {
        return (Date.now() - this.startTime) / 1000;
    }
}

export default SystemCore;
