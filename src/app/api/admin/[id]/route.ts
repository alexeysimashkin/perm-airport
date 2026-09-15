// Замените в самом верху файла src/app/api/admin/[id]/route.ts:
import { db } from '../../../../lib/db';

// Удаление рейса
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // departure или arrival
  const id = Number(params.id);

  if (type === 'departure') {
    db.deleteDeparture(id);
  } else if (type === 'arrival') {
    db.deleteArrival(id);
  } else {
    return NextResponse.json({ error: 'Неверный тип' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// Редактирование рейса
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = Number(params.id);
  const body = await request.json();

  if (type === 'departure') {
    db.updateDeparture(id, body);
  } else if (type === 'arrival') {
    db.updateArrival(id, body);
  } else {
    return NextResponse.json({ error: 'Неверный тип' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
