import { create } from "zustand";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

interface UserState {
  user: any | null;
  userData: { username: string; bestWpm: number };
  targetText: string; // New state
  loading: boolean;
  initialize: () => void;
  setTargetText: (text: string) => void; // New action
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userData: { username: "", bestWpm: 0 },
  targetText: "", // Start empty
  loading: true,

  setTargetText: (text) => set({ targetText: text }),

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
