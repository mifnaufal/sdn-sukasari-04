export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru' | 'user';
  created_at: string;
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
  created_at: string;
}
export interface Activity {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  date: string;
  created_by: number;
  created_at: string;
}
export interface Achievement {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  type: 'siswa' | 'sekolah';
  date: string;
  created_by: number;
  created_at: string;
}
export interface Staff {
  id: number;
  name: string;
  position: string;
  photo_url: string | null;
  description: string | null;
  created_at: string;
}