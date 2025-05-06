import { Trip } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  await Trip.updateOne(
    { _id: body.id, userEmail: session.user.email },
    { $set: { notes: body.notes } }
  );

  return NextResponse.json({ message: 'Notes updated.' });
}
