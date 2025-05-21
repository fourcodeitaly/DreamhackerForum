"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { SearchBar } from "@/components/layout/search-bar";
import { Menu, X, GraduationCap } from "lucide-react";
import { AuthStatus } from "../auth/auth-status";
import { CategoryNavigation } from "./category-navigation";
import { NotificationButton } from "@/components/notifications/notification-button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md dark:bg-gray-900/80 shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold">Dreamhacker</span>
            </Link>
            <nav className="ml-8 hidden md:flex space-x-6">
              {/* {navLinks.map((link) => {
                if (!isAdmin && link.href === "/posts?page=1&nullPosts=true") {
                  return null;
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                      pathname === link.href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })} */}
              <CategoryNavigation />
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* <SearchBar className="w-64" /> */}
            <LanguageToggle />
            <ModeToggle />
            <NotificationButton />
            <AuthStatus />
          </div>

          <div className="flex md:hidden">
            <NotificationButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <SearchBar className="w-full" />
            <nav className="flex flex-col space-y-4">
              {/* {navLinks.map((link) => {
                if (!isAdmin && link.href === "/posts?page=1&nullPosts=true") {
                  return null;
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                      pathname === link.href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })} */}
              <CategoryNavigation />
            </nav>
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-800">
              <div className="flex space-x-2">
                <LanguageToggle />
                <ModeToggle />
              </div>
              <AuthStatus />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
