import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === 'admin123') {
      const response = NextResponse.json({ success: true });
      
      // Записываем куку сессии на 4 часа
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 4,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Неверный пароль сотрудника' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
