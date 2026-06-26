"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginAction, addChiefWardenAction, addWardenAction, deleteWardenAction, deleteChiefWardenAction,
  addStudentAction, deleteStudentAction, allotRoomAction,
  addComplaintAction, updateComplaintStatusAction,
  addNoticeAction, updateMenuAction, addFoodReviewAction,
  requestNameUpdateAction, approveNameUpdateAction, rejectNameUpdateAction,
  cleanupResolvedComplaints, getAllData, updateWardenEmailAction
} from "@/app/actions";

export type Role = "author" | "chief_warden" | "warden" | "student" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roomId?: string | null;
  isAcPreference?: boolean;
  room?: Room | null;
}

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  isAc: boolean;
  occupants: User[];
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  room: string;
  category: string;
  title: string;
  details: string;
  status: string;
  createdAt: Date;
  resolvedAt?: Date | null;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  day: string;
  meal: string;
  description: string;
}

export interface FoodReview {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  review: string;
  createdAt: Date;
}

export interface NameUpdate {
  id: string;
  studentId: string;
  newName: string;
  status: string;
  createdAt: Date;
  student: User;
}

export interface MockDataContextType {
  user: User | null;
  users: User[];
  rooms: Room[];
  complaints: Complaint[];
  notices: Notice[];
  menu: MenuItem[];
  foodReviews: FoodReview[];
  nameUpdates: NameUpdate[];
  loading: boolean;
  login: (email: string, pass: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addChiefWarden: (name: string, email: string, pass: string) => Promise<void>;
  addWarden: (name: string, email: string, pass: string) => Promise<boolean>;
  updateWardenEmail: (id: string, newEmail: string) => Promise<void>;
  deleteWarden: (id: string) => Promise<void>;
  deleteChiefWarden: (id: string) => Promise<void>;
  addStudent: (name: string, email: string, pass: string, isAcPref: boolean) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  allotRoom: (studentId: string, roomId: string) => Promise<boolean>;
  addComplaint: (category: string, title: string, details: string) => Promise<void>;
  updateComplaintStatus: (id: string, status: string) => Promise<void>;
  addNotice: (title: string, content: string) => Promise<void>;
  updateMenu: (day: string, meal: string, description: string) => Promise<void>;
  addFoodReview: (rating: number, review: string) => Promise<void>;
  requestNameUpdate: (newName: string) => Promise<{ success: boolean; message: string }>;
  approveNameUpdate: (requestId: string) => Promise<void>;
  rejectNameUpdate: (requestId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [foodReviews, setFoodReviews] = useState<FoodReview[]>([]);
  const [nameUpdates, setNameUpdates] = useState<NameUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const data = await getAllData();
    setUsers(data.users as User[]);
    setRooms(data.rooms as Room[]);
    setComplaints(data.complaints as Complaint[]);
    setNotices(data.notices as Notice[]);
    setMenu(data.menu);
    setFoodReviews(data.foodReviews as FoodReview[]);
    setNameUpdates(data.nameUpdates as NameUpdate[]);
  }, []);

  useEffect(() => {
    const init = async () => {
      // Restore session from localStorage
      const stored = localStorage.getItem("sh_user_session");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      await cleanupResolvedComplaints();
      await refreshData();
      setLoading(false);
    };
    init();
  }, [refreshData]);

  // Keep user in sync if their name changes (e.g. after name update approval)
  useEffect(() => {
    if (user && users.length > 0) {
      const freshUser = users.find(u => u.id === user.id);
      if (freshUser && freshUser.name !== user.name) {
        setUser(freshUser);
        localStorage.setItem("sh_user_session", JSON.stringify(freshUser));
      }
    }
  }, [users, user]);

  const login = async (email: string, password: string, role: string) => {
    const result = await loginAction(email, password, role);
    if (result.success && result.user) {
      setUser(result.user as User);
      localStorage.setItem("sh_user_session", JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sh_user_session");
  };

  const addChiefWarden = async (name: string, email: string, pass: string) => {
    await addChiefWardenAction(name, email, pass);
    await refreshData();
  };

  const addWarden = async (name: string, email: string, pass: string) => {
    const result = await addWardenAction(name, email, pass);
    await refreshData();
    return result;
  };

  const updateWardenEmail = async (id: string, newEmail: string) => {
    await updateWardenEmailAction(id, newEmail);
    await refreshData();
  };

  const deleteWarden = async (id: string) => {
    await deleteWardenAction(id);
    await refreshData();
  };

  const deleteChiefWarden = async (id: string) => {
    await deleteChiefWardenAction(id);
    await refreshData();
  };

  const addStudent = async (name: string, email: string, pass: string, isAcPref: boolean) => {
    await addStudentAction(name, email, pass, isAcPref);
    await refreshData();
  };

  const deleteStudent = async (id: string) => {
    await deleteStudentAction(id);
    await refreshData();
  };

  const allotRoom = async (studentId: string, roomId: string) => {
    const result = await allotRoomAction(studentId, roomId);
    await refreshData();
    return result;
  };

  const addComplaint = async (category: string, title: string, details: string) => {
    if (!user) return;
    await addComplaintAction(user.id, category, title, details);
    await refreshData();
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    await updateComplaintStatusAction(id, status);
    await refreshData();
  };

  const addNotice = async (title: string, content: string) => {
    if (!user) return;
    await addNoticeAction(user.name, title, content);
    await refreshData();
  };

  const updateMenu = async (day: string, meal: string, description: string) => {
    await updateMenuAction(day, meal, description);
    await refreshData();
  };

  const addFoodReview = async (rating: number, review: string) => {
    if (!user) return;
    await addFoodReviewAction(user.id, user.name, rating, review);
    await refreshData();
  };

  const requestNameUpdate = async (newName: string) => {
    if (!user) return { success: false, message: "Not logged in." };
    const result = await requestNameUpdateAction(user.id, newName);
    await refreshData();
    return result;
  };

  const approveNameUpdate = async (requestId: string) => {
    await approveNameUpdateAction(requestId);
    await refreshData();
  };

  const rejectNameUpdate = async (requestId: string) => {
    await rejectNameUpdateAction(requestId);
    await refreshData();
  };

  return (
    <DataContext.Provider value={{
      user, loading, login, logout,
      users, addChiefWarden, addWarden, updateWardenEmail, deleteWarden, deleteChiefWarden, addStudent, deleteStudent,
      rooms, allotRoom,
      complaints, addComplaint, updateComplaintStatus,
      notices, addNotice,
      menu, updateMenu,
      foodReviews, addFoodReview,
      nameUpdates, requestNameUpdate, approveNameUpdate, rejectNameUpdate,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
