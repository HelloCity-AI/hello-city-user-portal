/**
 * Task Status API
 * Proxies task status requests from Frontend to Python AI Service
 */

export const runtime = 'edge';

const PYTHON_SERVICE_URL = process.env.PUBLIC_NEXT_PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function GET(_req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params;

    if (!taskId) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Task Status API] Fetching status for task: ${taskId}`);

    // Forward to Python service
    const response = await fetch(`${PYTHON_SERVICE_URL}/tasks/${taskId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Task Status API] Python service error:', {
        status: response.status,
        body: errorText,
      });
      return new Response(
        JSON.stringify({
          error: `Python service returned ${response.status}`,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await response.json();

    console.log(`[Task Status API] Task ${taskId} status:`, data.status);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    console.error('[Task Status API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
