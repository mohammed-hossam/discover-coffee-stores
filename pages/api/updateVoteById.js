export default async function updateVoteById(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.id;
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
        } else {
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
