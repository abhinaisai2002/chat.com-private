export async function fetchBoards() {
  // console.log('hi');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board/boards`, {
      method: 'GET',
    });
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (err) {
    // console.log(err);
    return 'Error';
  }
}
