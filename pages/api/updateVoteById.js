import { table } from '../../lib/airtable';

export default async function updateVoteById(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      if (id) {
        const findRecordById = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findRecordById.length !== 0) {
          const record = findRecordById.map((record) => {
            return { recordId: record.id, ...record.fields };
          });

          const calculatedVoting = parseInt(record[0].voting) + 1;
          const updateRecord = await table.update([
            {
              id: record[0].recordId,
              fields: {
                voting: calculatedVoting,
              },
            },
          ]);

          if (updateRecord) {
            const record = updateRecord.map((record) => {
              return { recordId: record.id, ...record.fields };
            });
            res.json(record);
          }
        } else {
          res.status(200);
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({ message: 'Error upvoting coffee store', err });
    }
  }
}
