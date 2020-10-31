/**
 * Build array of sequences with their associated processes.
 *
 * @param {object} processes
 * @return {array}
 */
export const buildSequencesFromProcesses = (processes) => {
  return processes.reduce((sequences, process) => {
    if (sequences[process.sequence] === undefined) {
      sequences[process.sequence] = {
        id: process.sequence,
        name: process.name,
        processes: []
      };
    }
    sequences[process.sequence].processes.push(process);
    return sequences;
  }, []);
};