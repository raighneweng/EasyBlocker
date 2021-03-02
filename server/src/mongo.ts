import mongoose, { ConnectionOptions } from 'mongoose';

export default {
    connect,
    disconnect,
};

function connect(url: string, ssl: boolean, writeConcern: boolean) {
    const options: ConnectionOptions = {
        keepAlive: true,
        connectTimeoutMS: 30000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        ssl,
        authSource: 'admin',
        poolSize: 200,
    };

    if (writeConcern) {
        mongoose.plugin(function (schema: any) {
            schema.options.writeConcern = {
                // w: 'majority', // The 'majority' option means the query promise won't resolve until the query has propagated to the majority of the replica set
                j: true, // the write must commit to the journal
                wtimeout: 10000, // timeout after 10 seconds
            };
        });
    }

    return mongoose.connect(url, options);
}

function disconnect() {
    return mongoose.disconnect();
}
