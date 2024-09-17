"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SpeedTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ downloadSpeed: 0, uploadSpeed: 0 });
  const [error, setError] = useState('');

  const runSpeedTest = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Download speed test
      const downloadStart = Date.now();
      const downloadResponse = await fetch('/api/speedtest');
      const downloadData = await downloadResponse.json();
      const downloadEnd = Date.now();
      const downloadDuration = (downloadEnd - downloadStart) / 1000; // seconds
      const downloadSpeed = (downloadData.testData.length / downloadDuration / 125000).toFixed(2); // Mbps

      // Upload speed test
      const uploadData = { testData: downloadData.testData };
      const uploadStart = Date.now();
      await fetch('/api/speedtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      });
      const uploadEnd = Date.now();
      const uploadDuration = (uploadEnd - uploadStart) / 1000; // seconds
      const uploadSpeed = (uploadData.testData.length / uploadDuration / 125000).toFixed(2); // Mbps

      setResults({ downloadSpeed: parseFloat(downloadSpeed), uploadSpeed: parseFloat(uploadSpeed) });
    } catch (err) {
      setError('Failed to run speed test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Internet Speed Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={runSpeedTest} 
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running test...
            </>
          ) : (
            'Start Speed Test'
          )}
        </Button>
        
        {error && <p className="text-red-500 mb-2">{error}</p>}
        
        {!isLoading && results.downloadSpeed > 0 && (
          <div className="space-y-2">
            <p>Download Speed: {results.downloadSpeed.toFixed(2)} Mbps</p>
            <p>Upload Speed: {results.uploadSpeed.toFixed(2)} Mbps</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedTest;