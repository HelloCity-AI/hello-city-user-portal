import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';

export async function GET(request: NextRequest) {
  try {
    // 获取当前会话
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: '未认证用户' }, { status: 401 });
    }

    // 尝试获取访问令牌（Next.js 14 App Router正确用法）
    try {
      const accessTokenResult = await auth0.getAccessToken();

      if (accessTokenResult?.token) {
        return NextResponse.json({
          accessToken: accessTokenResult.token,
          tokenType: 'Bearer',
          message: '成功获取访问令牌',
        });
      } else {
        // 如果没有访问令牌，可能是因为没有配置audience
        return NextResponse.json({
          message: '用户已认证，但无法获取访问令牌（可能未配置API audience）',
          user: session.user,
          hasSession: true,
        });
      }
    } catch (tokenError) {
      console.warn('无法获取访问令牌:', tokenError);
      return NextResponse.json({
        message: '用户已认证，但获取访问令牌失败',
        user: session.user,
        hasSession: true,
        tokenError: tokenError instanceof Error ? tokenError.message : String(tokenError),
      });
    }
  } catch (error) {
    console.error('获取会话失败:', error);
    return NextResponse.json(
      {
        error: '获取会话时发生错误',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
