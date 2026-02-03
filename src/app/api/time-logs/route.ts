import { NextRequest, NextResponse } from 'next/server';
import { fetchTimeLogsFromDevice } from '@/actions/timeLogs';

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
