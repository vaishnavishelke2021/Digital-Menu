import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
      if (restaurantDoc.exists()) {
        res.status(200).json(restaurantDoc.data());
      } else {
        res.status(404).json({ error: 'Restaurant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      await setDoc(doc(db, 'restaurants', id), req.body, { merge: true });
      res.status(200).json({ message: 'Restaurant updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
