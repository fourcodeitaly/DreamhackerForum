import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { getServerTranslation } from "@/lib/get-translation";

const LOCATIONS = [
  { code: "all", name: "allNation" },
  { code: "us", name: "us" },
  { code: "uk", name: "uk" },
  { code: "ca", name: "ca" },
  { code: "au", name: "au" },
  { code: "sg", name: "sg" },
  { code: "hk", name: "hk" },
  { code: "cn", name: "cn" },
  { code: "jp", name: "jp" },
  { code: "kr", name: "kr" },
  { code: "tw", name: "tw" },
  { code: "de", name: "de" },
  { code: "fr", name: "fr" },
];

interface SchoolNationFilterProps {
  location: string;
}

export async function SchoolNationFilter({
  location,
}: SchoolNationFilterProps) {
  const { t } = await getServerTranslation();
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
                    {t(loc.name)}
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
