export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru' | 'user';
  created_at: Date;
}
export interface SchoolProfile {
  id: number;
  school_name: string;
  address: string;
  phone: string;
  email: string;
  vision: string;
  mission: string;
  about: string;
}
export interface Activity {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  date: Date;
  created_by: number;
}
export interface Achievement {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  type: 'siswa' | 'sekolah';
  date: Date;
  created_by: number;
}