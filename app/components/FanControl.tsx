'use client';

import { useEffect, useState } from 'react';
import { onFanStatusChange, setFanStatus, onESP8266DataChange } from '@/lib/firebase';

export default function FanControl() {
  const [fanStatus, setFanStatusState] = useState<boolean>(false);
  const [espData, setESPData] = useState<any>(null);

  useEffect(() => {
    // Listen to fan status changes
    const unsubscribeFan = onFanStatusChange((status) => {
      setFanStatusState(status);
    });

    // Listen to ESP8266 data changes
    const unsubscribeESP = onESP8266DataChange((data) => {
      setESPData(data);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeFan();
      unsubscribeESP();
    };
  }, []);

  const toggleFan = async () => {
    try {
      await setFanStatus(!fanStatus);
    } catch (error) {
      console.error('Error toggling fan:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Fan Control</h2>
        <button
          onClick={toggleFan}
          className={`px-4 py-2 rounded ${
            fanStatus ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {fanStatus ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">ESP8266 Data</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(espData, null, 2)}
        </pre>
      </div>
    </div>
  );
} 