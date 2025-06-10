import { UserData } from "@/app/dashboard/page";

export function stringToEnum<T>(enumObj: T, value: string): T[keyof T] | undefined {
  return (enumObj as any)[value];
}

export async function fetchTeachers(): Promise<UserData[]> {
  const res = await fetch(`${process.env.API_BASE_URL}/api/teachers`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch teachers");
  const teachersData = await res.json();
  return teachersData.data;
}

export async function fetchStudents(): Promise<UserData[]> {
  const res = await fetch(`${process.env.API_BASE_URL}/api/students`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch students");
  const studentsData = await res.json();
  return studentsData.data;
}

export function convertDateToReadableDate(date: string | Date): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const validDate = typeof date === 'string' ? new Date(date) : date;
  return validDate.toLocaleDateString('en-US', options);
}