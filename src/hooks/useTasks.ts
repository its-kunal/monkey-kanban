import {
  DocumentSnapshot,
  Timestamp,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { Task } from "@/types/Task";
import { firestore } from "@/lib/firebase";
import { useAuthContext } from "./AuthContext";

type taskNew = Omit<Task, "dueDate">;

export interface FirebaseTaskType extends taskNew {
  dueDate: Timestamp;
}

export interface FirebaseTaskDocument {
  tasks: FirebaseTaskType[];
}

// get all the tasks, and to edit a task
export const useTasks = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task[]>([]);
  const { uid } = user || {};

  const updateCb = useCallback(
    async (newTaskList: Task[]) => {
      console.log(newTaskList);
      const fbTaskList = newTaskList.map((task) => {
        const obj = {
          ...task,
          ...(task.dueDate !== undefined && {
            dueDate: Timestamp.fromDate(task.dueDate),
          }),
        };
        if (obj.dueDate === undefined) {
          delete obj.dueDate;
        }
        return obj;
      });
      await updateDoc(doc(firestore, `kanban/${uid}`), { tasks: fbTaskList });
    },
    [uid]
  );

  useEffect(() => {
    const initCb = async () => {
      await setDoc(doc(firestore, `kanban/${uid}`), { tasks: [] });
    };
    if (user === undefined) return;
    const getDocCb = async (document: DocumentSnapshot) => {
      setLoading(true);
      const fbDoc = document.data() as unknown as FirebaseTaskDocument;
      console.log(fbDoc);
      if (fbDoc === undefined) {
        await initCb();
        setTimeout(async () => {
          await getDocCb(document);
        }, 1000);
        return;
      } else {
        setTask(
          fbDoc.tasks.map((task) => ({
            ...task,
            ...(task.dueDate && { dueDate: task.dueDate.toDate() }),
          })) || []
        );
      }
      setLoading(false);
    };
    const unsub = onSnapshot(doc(firestore, `kanban/${uid}`), getDocCb);

    return () => {
      unsub();
    };
  }, [uid, user]);

  return { data: task, updateCb, loading };
};
