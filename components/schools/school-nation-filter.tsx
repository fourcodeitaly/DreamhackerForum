"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const LOCATIONS = [
  { code: "us", name: "United States" },
  { code: "uk", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "sg", name: "Singapore" },
  { code: "hk", name: "Hong Kong" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "tw", name: "Taiwan" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
];

export function SchoolNationFilter({ location }: { location: string }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("nations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">{t("location")}</h4>
            <div className="space-y-2">
              {LOCATIONS.map((loc) => (
                <Link
                  key={loc.code}
                  href={`/schools?location=${loc.code}`}
                  className="block"
                >
                  <Button
                    variant={location === loc.code ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    {t(loc.code)}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
