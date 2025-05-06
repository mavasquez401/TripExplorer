import { Trip } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const existing = await Trip.findOne({
    name: body.name,
    userEmail: session.user.email,
  });

  if (existing) {
    return NextResponse.json(
      { message: 'Trip already saved.' },
      { status: 409 }
    );
  }

  const trip = await Trip.create({
    ...body,
    userEmail: session.user.email,
  });

  return NextResponse.json(trip);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const trips = await Trip.find({ userEmail: session.user.email });
  return NextResponse.json(trips);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  await Trip.deleteOne({
    _id: body.id,
    userEmail: session.user.email,
  });

  return NextResponse.json({ message: 'Trip deleted.' });
}
