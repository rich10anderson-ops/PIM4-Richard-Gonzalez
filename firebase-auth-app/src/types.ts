export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface TaskFormValues {
  title: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  message: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
  success: string | null;
}
