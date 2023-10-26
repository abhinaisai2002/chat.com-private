import axios from 'axios';
import { uuid } from 'uuidv4';

export default async function createBoard() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board/create`, {
      method:"POST"
    });
    if (!response.ok) {
      throw new Error("Limited");
    }
    const data = await response.json();
    return data;
  }
  catch (err) {
    throw err;
  }
}
