"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { getUserAccounts } from "@/actions/accounts"; 

export default function ChatbotButton() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  
  const {
    loading,
    fn: fetchUserData,
    data: accountsData,
  } = useFetch(getUserAccounts);

  useEffect(() => {
    if (user) {
      // Fetch real database data
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (accountsData) {
      const defaultAccount = accountsData.find(acc => acc.isDefault) || accountsData[0];
      setUserData({
        clerkUserId: user.id,
        dbUserId: accountsData[0]?.userId, // Real database user ID
        accountId: defaultAccount?.id,
        accountName: defaultAccount?.name
      });
      
      // Log the real data
      console.log("Clerk User ID:", user.id);
      console.log("Database User ID:", accountsData[0]?.userId);
      console.log("Default Account ID:", defaultAccount?.id);
      console.log("Account Name:", defaultAccount?.name);
    }
  }, [accountsData, user]);

  const handleChatbotClick = () => {
    if (userData) {
      const chatbotUrl = `https://chat-bot-welth.vercel.app?userid=${userData.dbUserId}&accountid=${userData.accountId}`;
      window.open(chatbotUrl, "_blank");
    } else {
      window.open("https://chat-bot-welth.vercel.app", "_blank");
    }
  };

  return (
    <button
      onClick={handleChatbotClick}
      className="fixed bottom-8 right-8 z-50 transition-transform hover:scale-110"
      aria-label="Open chat bot"
      disabled={loading}
    >
      <img
        src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
        alt="Chat Bot"
        className={`h-16 w-16 rounded-full shadow-lg ${loading ? 'opacity-50' : ''}`}
      />
    </button>
  );
}
