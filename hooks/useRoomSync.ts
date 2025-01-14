// import { useState, useEffect } from 'react';
// import { listenToRoom, updatePlayback } from '../api/sync';

// export const useRoomSync = (roomId: string) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [timestamp, setTimestamp] = useState(0);

//   useEffect(() => {
//     const unsubscribe = listenToRoom(roomId, (data) => {
//       setIsPlaying(data?.isPlaying || false);
//       setTimestamp(data?.timestamp || 0);
//     });
//     return () => unsubscribe();
//   }, [roomId]);

//   const togglePlay = () => updatePlayback(roomId, timestamp, !isPlaying);

//   return { isPlaying, timestamp, togglePlay };
// };
