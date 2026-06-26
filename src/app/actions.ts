"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOTP, sendComplaintNotification, sendComplaintStatusUpdate } from "@/lib/mail";

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAction(email: string, password: string, role: string) {
  try {
    let user;
    if (role === "author") {
      user = await prisma.user.findFirst({
        where: { name: email, password, role }
      });
    } else {
      user = await prisma.user.findFirst({
        where: { email, password, role }
      });
    }
    
    if (!user) return { success: false, user: null, error: "Invalid credentials." };

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roomId: user.roomId,
      isAcPreference: user.isAcPreference,
    };

    return { success: true, user: safeUser };
  } catch (e) {
    console.error("loginAction error:", e);
    return { success: false, user: null, error: "Something went wrong." };
  }
}



// ─── User Management ─────────────────────────────────────────────────────────

export async function addChiefWardenAction(name: string, email: string, pass: string) {
  await prisma.user.deleteMany({ where: { role: "chief_warden" } });
  await prisma.user.create({ data: { name, email, password: pass, role: "chief_warden" } });
  revalidatePath("/author");
}

export async function addWardenAction(name: string, email: string, pass: string) {
  const count = await prisma.user.count({ where: { role: "warden" } });
  if (count >= 2) return false;
  await prisma.user.create({ data: { name, email, password: pass, role: "warden" } });
  revalidatePath("/author");
  return true;
}

export async function deleteWardenAction(id: string) {
  await prisma.user.deleteMany({ where: { id, role: "warden" } });
  revalidatePath("/author");
}

export async function updateWardenEmailAction(id: string, newEmail: string) {
  await prisma.user.updateMany({
    where: { id, role: { in: ["warden", "chief_warden"] } },
    data: { email: newEmail }
  });
  revalidatePath("/author");
}

export async function deleteChiefWardenAction(id: string) {
  await prisma.user.deleteMany({ where: { id, role: "chief_warden" } });
  revalidatePath("/author");
}

export async function addStudentAction(name: string, email: string, pass: string, isAcPref: boolean) {
  await prisma.user.create({ data: { name, email, password: pass, role: "student", isAcPreference: isAcPref } });
  revalidatePath("/chief-warden");
}

export async function deleteStudentAction(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/chief-warden");
  revalidatePath("/warden");
}

// ─── Rooms ───────────────────────────────────────────────────────────────────

export async function allotRoomAction(studentId: string, roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { occupants: true }
  });
  if (!room || room.occupants.length >= room.capacity) return false;

  // Remove student from old room
  await prisma.user.update({
    where: { id: studentId },
    data: { roomId: null }
  });

  // Assign new room
  await prisma.user.update({
    where: { id: studentId },
    data: { roomId }
  });
  revalidatePath("/chief-warden");
  return true;
}

// ─── Complaints ──────────────────────────────────────────────────────────────

export async function addComplaintAction(studentId: string, category: string, title: string, details: string) {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: { room: true }
  });
  if (!student) return;
  const roomNumber = student.room?.roomNumber || "Unassigned";
  await prisma.complaint.create({
    data: {
      studentId,
      studentName: student.name,
      room: roomNumber,
      category,
      title,
      details,
      status: "Open"
    }
  });

  // Notify Wardens
  const wardens = await prisma.user.findMany({
    where: { role: { in: ["warden", "chief_warden"] } },
    select: { email: true }
  });
  
  for (const warden of wardens) {
    await sendComplaintNotification(warden.email, title, details, student.name);
  }

  revalidatePath("/student");
}

export async function updateComplaintStatusAction(id: string, status: string) {
  const complaint = await prisma.complaint.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "Resolved" ? new Date() : undefined
    },
    include: { student: true }
  });

  // Notify Student
  if (complaint.student?.email) {
    await sendComplaintStatusUpdate(complaint.student.email, complaint.title, status);
  }

  revalidatePath("/warden");
  revalidatePath("/chief-warden");
}

// Auto-cleanup: delete resolved complaints older than 21 days
export async function cleanupResolvedComplaints() {
  const cutoff = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
  await prisma.complaint.deleteMany({
    where: { status: "Resolved", resolvedAt: { lt: cutoff } }
  });
}

// ─── Notices ─────────────────────────────────────────────────────────────────

export async function addNoticeAction(authorName: string, title: string, content: string) {
  await prisma.notice.create({ data: { title, content, authorName } });
  revalidatePath("/warden");
  revalidatePath("/student");
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export async function updateMenuAction(day: string, meal: string, description: string) {
  await prisma.menuItem.upsert({
    where: { day_meal: { day, meal } },
    update: { description },
    create: { day, meal, description }
  });
  revalidatePath("/warden");
  revalidatePath("/chief-warden");
  revalidatePath("/student");
}

// ─── Food Reviews ─────────────────────────────────────────────────────────────

export async function addFoodReviewAction(studentId: string, studentName: string, rating: number, review: string) {
  await prisma.foodReview.create({ data: { studentId, studentName, rating, review } });
  revalidatePath("/student");
}

// ─── Name Update Requests ─────────────────────────────────────────────────────

export async function requestNameUpdateAction(studentId: string, newName: string) {
  // Check if there's already a pending request
  const existing = await prisma.nameUpdate.findFirst({
    where: { studentId, status: "Pending" }
  });
  if (existing) return { success: false, message: "You already have a pending name update request." };

  await prisma.nameUpdate.create({ data: { studentId, newName, status: "Pending" } });
  revalidatePath("/student");
  return { success: true, message: "Name update request submitted!" };
}

export async function approveNameUpdateAction(requestId: string) {
  const request = await prisma.nameUpdate.findUnique({ where: { id: requestId } });
  if (!request) return;

  // Update student's name
  await prisma.user.update({ where: { id: request.studentId }, data: { name: request.newName } });

  // Mark request as approved
  await prisma.nameUpdate.update({ where: { id: requestId }, data: { status: "Approved" } });
  revalidatePath("/chief-warden");
}

export async function rejectNameUpdateAction(requestId: string) {
  await prisma.nameUpdate.update({ where: { id: requestId }, data: { status: "Rejected" } });
  revalidatePath("/chief-warden");
}

// ─── Data Fetchers ────────────────────────────────────────────────────────────

export async function getAllData() {
  const [users, rooms, complaints, notices, menu, foodReviews, nameUpdates] = await Promise.all([
    prisma.user.findMany({ include: { room: true } }),
    prisma.room.findMany({ include: { occupants: true } }),
    prisma.complaint.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.notice.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.menuItem.findMany(),
    prisma.foodReview.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.nameUpdate.findMany({ include: { student: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return { users, rooms, complaints, notices, menu, foodReviews, nameUpdates };
}
