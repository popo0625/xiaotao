import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ accepted: true }); // not logged in = no modal
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { disclaimerAccepted: true },
  });

  return NextResponse.json({ accepted: user?.disclaimerAccepted ?? false });
}
