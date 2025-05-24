import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import { getMockScholarships, Scholarship } from "@/lib/mock/scholarships";

export const dynamic = "force-dynamic";

export default async function ScholarshipsPage() {
  const scholarships = await getMockScholarships();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Scholarship Opportunities
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover and apply for scholarships to support your educational
              journey
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add filters here */}
                  <div>
                    <h4 className="font-medium mb-2">Amount Range</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Under $5,000
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        $5,000 - $10,000
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        $10,000 - $20,000
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Over $20,000
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Study Level</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Undergraduate
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Graduate
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        PhD
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Country</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        United States
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        United Kingdom
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Australia
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Canada
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scholarships List */}
          <div className="lg:col-span-2 space-y-6">
            {scholarships.map((scholarship: Scholarship) => (
              <Card key={scholarship.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Scholarship Image */}
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={scholarship.imageUrl}
                        alt={scholarship.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Scholarship Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {scholarship.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {scholarship.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize",
                            scholarship.type === "full" &&
                              "bg-green-100 text-green-800",
                            scholarship.type === "partial" &&
                              "bg-blue-100 text-blue-800"
                          )}
                        >
                          {scholarship.type} Scholarship
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {scholarship.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Deadline:{" "}
                            {format(scholarship.deadline, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{scholarship.country}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-4">
                        <Button>View Details</Button>
                        <Button variant="outline">Save</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
