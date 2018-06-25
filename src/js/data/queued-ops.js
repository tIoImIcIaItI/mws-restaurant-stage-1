import config from '../config';
import { getDb, getStore } from './db';

const getQueuedOpsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.queuedOps.name, mode);

const getQueuedOps = (mode = 'readonly') =>
	getDb().then(db => getQueuedOpsStore(db, mode));

const getQueuedOpsForWrite = () => 
	getQueuedOps('readwrite');

const QueuedOps = {
	
	insert: (op) =>
		getQueuedOpsForWrite().
			then(ops => ops.put(op)).
			catch(console.error),

	getAll: () =>
		getQueuedOps().
			then(ops => ops.getAll()).
			catch(console.error),

	delete: (key) =>
		getQueuedOpsForWrite().
			then(ops => ops.delete(key)).
			catch(console.error)
};

export default QueuedOps;
