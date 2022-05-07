import { table } from '../../lib/airtable';

export default async function getCoffeeStoreById(req, res) {
  try {
    const { id } = req.query;
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
        res.status(200);
        res.json(record);
      } else {
        res.status(400);
        res.json({ message: `id could not be found` });
      }
    } else {
      res.status(400);
      console.log('Id is missing');
      res.json({ message: 'Id is missing' });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: 'Something went wrong', err });
  }
}
