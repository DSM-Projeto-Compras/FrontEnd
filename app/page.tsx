"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/pages/login");
  }, [router]);

  return null;
};

export default Home;
