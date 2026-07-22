import React, { createContext, useState, useContext } from 'react';

// 1. 프로필 데이터의 형태(타입)를 정의합니다.
interface User {
  name: string;
  role: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

// 2. 빈 컨텍스트(통제실)를 생성합니다.
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. 앱 전체를 감싸줄 '공급자(Provider)' 컴포넌트를 만듭니다.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  
  // 💡 앱 전체에서 공유될 초기 프로필 데이터입니다!
  const [user, setUser] = useState<User>({
    name: '조범준',
    role: '2학년 개발자 (Java & Linux)',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 4. 다른 파일에서 이 통제실의 데이터를 쉽게 꺼내 쓸 수 있게 해주는 마법의 훅(Hook)입니다.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser는 반드시 UserProvider 안에서 사용되어야 합니다!');
  }
  return context;
};