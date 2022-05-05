// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { table } from '../../lib/airtable';

export default async function createCoffeeStore(req, res) {
  if (req.method == 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    try {
      if (id) {
        //find a record
        const findRecordById = await table
          .select({
            // Selecting the first 3 records in Grid view:
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findRecordById.length !== 0) {
          const record = findRecordById.map((record) => {
            return { recordId: record.id, ...record.fields };
          });
          res.status(200);
          res.json(record);
        } else {
          //cretae a record
          if (name) {
            const createdRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const record = createdRecords.map((record) => {
              return { recordId: record.id, ...record.fields };
            });
            res.status(200);
            res.json(record);
          } else {
            res.status(400);
            console.log('Id or name is missing');
            res.json({ message: 'Id or name is missing' });
          }
        }
      } else {
        res.status(400);
        console.log('Id is missing');
        res.json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error creating or finding a store', err);
      res.status(500);
      res.json({ message: 'Error creating or finding a store', err });
    }
  }
}
