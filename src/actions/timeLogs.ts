import { NextRequest, NextResponse } from 'next/server';

export async function fetchTimeLogsFromDevice(deviceUri: string, dateFrom: string, dateTo: string) {
  try {
    // Construct API URL
    const apiUrl = deviceUri.endsWith('/') 
      ? `${deviceUri}attendance?start=${dateFrom}&end=${dateTo}&format=json`
      : `${deviceUri}/attendance?start=${dateFrom}&end=${dateTo}&format=json`;

    console.log(`Fetching time logs from: ${apiUrl}`);

    // Call device API from server-side (no CORS issues)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HRMO-Payroll-System/1.0',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data,
      message: `Successfully fetched ${data.count || 0} time logs`
    };

  } catch (error) {
    console.error('Failed to fetch time logs from device:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch time logs',
      data: null
    };
  }
}

// API route handler for client-side calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceUri, dateFrom, dateTo } = body;

    if (!deviceUri || !dateFrom || !dateTo) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: deviceUri, dateFrom, dateTo' },
        { status: 400 }
      );
    }

    const result = await fetchTimeLogsFromDevice(deviceUri, dateFrom, dateTo);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
