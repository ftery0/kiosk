"use client";
import { fetchCreateOrder } from "@/api/order";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOrderTypeStore } from "@/store/useOrderTypeStore";


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}

const Cart = ({ cartItems, updateQuantity, removeItem }: CartProps) => {
  const router = useRouter();
  const t = useTranslations("Cart");
  const { orderType } = useOrderTypeStore();
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    setTimeLeft(60);
  };

  const startTimer = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, []);

  useEffect(() => {
  
    const inactivityTimeout = setTimeout(() => {
      startTimer();
    }, 1000); 

    return () => {
      clearTimeout(inactivityTimeout);
    };
  }, [timeLeft]);


  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePurchase = async () => {
    try {
      
      console.log("현재 orderType:", orderType);
      if (!orderType) {
        alert("이용 유형이 선택되지 않았습니다.");
        router.push("/");
        return;
      }
      
      const items = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      
      await fetchCreateOrder(items, orderType);
      
      
      alert(t("orderSuccess"));
      cartItems.forEach((item) => removeItem(item.id));
      router.push("/");
    } catch (e: any) {
      alert(e.message || t("orderFailed"));
    }
  };

  return (
    <footer className="bg-white border-t p-4 flex flex-col md:flex-row justify-between gap-4">
      
      <div className="md:w-1/6 w-full bg-gray-50 rounded-lg p-4 border shadow-sm flex items-center justify-center text-xl font-mono select-none">
        
        {timeLeft}
      </div>

      {/* 장바구니 아이템 목록 */}
      <div className="md:w-2/3 w-full">
        <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">{t("empty")}</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {cartItems.map(({ id, name, price, quantity }) => (
              <li
                key={id}
                className="relative flex justify-between items-center text-sm p-2 rounded border"
              >
                <div>
                  <span>
                    {name}{" "}
                    <button
                      className="px-2 bg-gray-200 rounded cursor-pointer"
                      onClick={() => updateQuantity(id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button
                      className="px-2 bg-gray-200 rounded cursor-pointer"
                      onClick={() => updateQuantity(id, 1)}
                    >
                      +
                    </button>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--primary)]">
                    {(price * quantity).toLocaleString() + " " + t("won")}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => removeItem(id)}
                    aria-label={t("removeItem")}
                  >
                    <AiOutlineClose size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 결제 정보 및 구매 버튼 */}
      <div className="md:w-1/6 w-full bg-gray-50 rounded-lg p-4 border shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t("paymentInfo")}</h3>
          
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">{t("total")}</span>
          <span className="font-bold text-[var(--primary)]">
            {totalAmount.toLocaleString() + " " + t("won")}
          </span>
        </div>
        <button
          className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded hover:bg-opacity-90 transition cursor-pointer"
          disabled={cartItems.length === 0}
          onClick={handlePurchase}
        >
          {t("purchase")}
        </button>
      </div>
    </footer>
  );
};

export default Cart;