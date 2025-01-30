import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { restaurantId } = req.query;

  if (req.method === 'GET') {
    try {
      const menuItemsRef = collection(db, 'menuItems');
      const q = query(menuItemsRef, where('restaurantId', '==', restaurantId));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { itemId, ...updateData } = req.body;
      await updateDoc(doc(db, 'menuItems', itemId), updateData);
      res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { itemId } = req.body;
      await deleteDoc(doc(db, 'menuItems', itemId));
      res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
