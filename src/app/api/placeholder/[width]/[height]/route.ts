import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const { width, height } = params;

  if (!width || !height || isNaN(parseInt(width)) || isNaN(parseInt(height))) {
    return new NextResponse('Invalid width or height parameters', { status: 400 });
  }

  const imageUrl = `https://picsum.photos/${width}/${height}`;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch image from picsum.photos: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error fetching placeholder image:', error);
    return new NextResponse('Error fetching placeholder image', { status: 500 });
  }
}
