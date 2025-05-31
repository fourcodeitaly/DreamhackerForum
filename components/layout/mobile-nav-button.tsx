"use client";

import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Activity,
  Plus,
  Calendar,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

export function MobileNavButton() {
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const data = [
    {
      title: t("posts"),
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      href: "/posts",
      color: "bg-blue-400 hover:bg-blue-500",
      position: "bottom-20",
    },
    {
      title: t("schools").split(")")[1],
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      href: "/schools?location=all",
      color: "bg-yellow-400 hover:bg-yellow-500",
      position: "bottom-36",
    },
    {
      title: t("events").split(")")[1],
      icon: <Calendar className="h-6 w-6 text-white" />,
      href: "/events",
      color: "bg-red-400 hover:bg-red-500",
      position: "bottom-52",
    },
  ];

  return (
    <div className="fixed bottom-10 right-10 z-50 md:hidden">
      <div className="relative">
        {/* Secondary Buttons */}
        <AnimatePresence>
          {isOpen && (
            <>
              {data.map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.3 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className={`absolute ${item.position} right-1`}
                >
                  <div className="flex gap-2 justify-end items-center ">
                    <p className="text-sm text-gray-500 text-nowrap p-2 border-2 rounded-full bg-white shadow-lg">
                      {item.title}
                    </p>
                    <Link href={item.href}>
                      <Button
                        size="icon"
                        className={`h-12 w-12 rounded-full shadow-lg ${item.color}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-7 w-7 text-primary-foreground" />
          </motion.div>
        </Button>
      </div>
    </div>
  );
}
