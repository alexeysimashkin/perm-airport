import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Kondratovo2026"; // Пароль по умолчанию

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Устанавливаем HTTP-only куку для защиты сессии
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 день
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Неверный пароль сотрудника' }, { status: 401 });
}
