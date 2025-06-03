"use client";

import { useState, useEffect } from "react";
import { Card } from "./card";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Event } from "@/lib/db/events/event-modify";

interface EventSlideshowProps {
  events: Event[];
}

export function EventSlideshow({ events }: EventSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (events.length === 0) return null;

  return (
    <div className="relative w-full h-[200px]">
      {/* Slideshow container */}
      <div className="relative h-[200px] overflow-hidden rounded-lg">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "translate-x-0"
                : index < currentIndex
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <Card className="h-full hover:bg-accent/50 transition-colors">
              <Link href={`/events/${event.id}`} className="block h-full">
                <div className="relative h-full">
                  {/* Event Image */}
                  <div className="absolute inset-0">
                    <img
                      src={
                        event.images && event.images.length > 0
                          ? event.images.find((image) =>
                              image.image_url.includes("event-image")
                            )?.image_url
                          : "/images/event-image.jpg"
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://freeillustrations.xyz/wp-content/uploads/2021/01/Meeting-Illustrations@4x.png";
                      }}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </div>

                  {/* Event Content */}
                  <div className="relative h-full p-6 flex flex-col justify-end w-10/12 md:w-11/12 mx-auto">
                    <h3 className="text-lg md:text-2xl font-bold mb-3 text-white tracking-tight shadow-xl">
                      {event.title}
                    </h3>
                    <div className="text-white/90 space-y-3">
                      <p className="text-sm md:text-lg font-medium flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-white/80" />
                        {format(event.start_date, "PPP")}
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-sm md:text-lg font-medium">
                          {event.location}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold tracking-wide uppercase">
                          {event.type}
                        </span>
                        {event.is_virtual && (
                          <span className="px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold tracking-wide uppercase">
                            Virtual
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full size-6 md:size-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full size-6 md:size-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </Button>

      {/* Dots indicator */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div> */}
    </div>
  );
}
