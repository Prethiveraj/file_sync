import { createContext, useContext } from 'react';

type AppStateContextType = {
  appDirectory: string | null;
};

export const AppStateContext = createContext<AppStateContextType>({
  appDirectory: null,
});

export const useAppState = () => useContext(AppStateContext);