import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

interface UserState {
  user: any | null;
  userData: { username: string; bestWpm: number };
  targetText: string;
  sourceText?: string;
  loading: boolean;
  initialize: () => void;
  setTargetText: (text: string) => void; // New action
  setSourceText: (text: string) => void; // New action
  topic: string;
  setTopic: (topic: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userData: { username: "", bestWpm: 0 },
  targetText: "", // Start empty
  sourceText: undefined,
  loading: true,
  topic: "",
  setTopic: (topic) => set({ topic }),
  setTargetText: (text) => set({ targetText: text }),
  setSourceText: (text) => set({ sourceText: text }),

  initialize: () => {
    onAuthStateChanged(auth, (currentUser) => {
      set({ user: currentUser });

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            set({
              userData: {
                username: doc.data().username,
                bestWpm: doc.data().bestWpm || 0,
              },
              loading: false,
            });
          }
        });
      } else {
        set({ userData: { username: "", bestWpm: 0 }, loading: false });
      }
    });
  },
}));
