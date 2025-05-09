"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LoginForm() {
  const { t } = useTranslation();
  const { login, resendConfirmationEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailNotConfirmed(false);

    try {
      await login({ email, password });
      router.push("/");
      toast({
        title: t("loginSuccess"),
        description: t("welcomeBack"),
      });
    } catch (err: any) {
      console.error("Login error:", err);

      // Check if the error is due to unconfirmed email
      if (
        err.message?.includes("Email not confirmed") ||
        err.error?.message?.includes("Email not confirmed")
      ) {
        setEmailNotConfirmed(true);
      } else {
        toast({
          title: t("loginError"),
          description: err.message || t("invalidCredentials"),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResendingEmail(true);
    try {
      await resendConfirmationEmail(email);
      toast({
        title: t("emailSent"),
        description: t("confirmationEmailResent"),
      });
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message || t("errorResendingEmail"),
        variant: "destructive",
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {emailNotConfirmed && (
            <Alert
              variant="default"
              className="bg-amber-50 text-amber-800 border-amber-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("emailNotConfirmed")}</AlertTitle>
              <AlertDescription>
                {t("pleaseConfirmEmail")}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal underline ml-1"
                  onClick={handleResendConfirmation}
                  disabled={isResendingEmail}
                >
                  {isResendingEmail
                    ? t("resendingEmail")
                    : t("resendConfirmationEmail")}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 font-normal h-auto"
                onClick={() => router.push("/forgot-password")}
              >
                {t("forgotPassword")}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? t("hidePassword") : t("showPassword")}
                </span>
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("login")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
