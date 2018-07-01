import QueuedOps from '../data/queued-ops';

const opFrom = (now, op, args) => ({
	ts: now,
	op,
	args: JSON.stringify(args)
});

const queueOp = (op, args, now = Date.now()) =>
	QueuedOps.
		insert(opFrom(now, op, args)).
		catch(console.error);

const sortByTimestampDescending = (ops) =>
	ops.sort((x, y) => y.ts - x.ts);

const parseEntries = (entries) =>
	entries.map(entry => ({
		...entry,
		args: JSON.parse(entry.args)
	}));

const mapEntries = (executors, entries) =>
	entries.map(entry => () =>
		executors[entry.op](...entry.args).
			then(() => QueuedOps.delete(entry.ts)));

const serializePromiseGenerators = (generators) => {
	return (generators && generators.length > 0) ?
		generators.reduce(
			(p, c) => p.then(c()),
			Promise.resolve(undefined)) :
		Promise.resolve(undefined);
}

const processQueuedOps = (executors) =>
	QueuedOps.
		getAll().
		then(sortByTimestampDescending).
		then(parseEntries).
		then(entries => mapEntries(executors, entries)).
		then(serializePromiseGenerators).
		catch(console.error);

export default {
	queueOp,
	processQueuedOps
};
