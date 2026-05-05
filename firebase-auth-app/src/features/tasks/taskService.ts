import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { FirestoreError, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Task, TaskFormValues } from '../../types';

const tasksCollection = collection(db, 'tasks');

function mapTask(snapshot: QueryDocumentSnapshot): Task {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: String(data.title ?? ''),
    completed: Boolean(data.completed),
    userId: String(data.userId ?? ''),
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
}

export function subscribeToUserTasks(
  userId: string,
  onNext: (tasks: Task[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const userTasksQuery = query(
    tasksCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    userTasksQuery,
    (snapshot) => onNext(snapshot.docs.map(mapTask)),
    onError,
  );
}

export async function createTask(userId: string, values: TaskFormValues) {
  const title = values.title.trim();
  if (!title) {
    throw new Error('La tarea no puede estar vacía.');
  }

  await addDoc(tasksCollection, {
    title,
    completed: false,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function toggleTaskStatus(task: Task) {
  await updateDoc(doc(db, 'tasks', task.id), {
    completed: !task.completed,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, 'tasks', taskId));
}
