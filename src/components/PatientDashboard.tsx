import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../pages/LoginForm.css";
import AddMedicationList from "../pages/AddMedicationList";
import supabase from "@/supabaseClient";

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [takenDates, setTakenDates] = useState<Set<string>>(new Set());
  const [medications, setMedications] = useState([]);
  const [totalTakenCount, setTotalTakenCount] = useState(0);

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isTodaySelected = isToday(selectedDate);
  const isSelectedDateTaken = takenDates.has(selectedDateStr);

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleMarkTaken = (date: string, imageFile?: File) => {
    setTakenDates((prev) => new Set(prev).add(date));
    console.log("Medication marked as taken for:", date);
    if (imageFile) {
      console.log("Proof image uploaded:", imageFile.name);
    }
  };

  /* const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date(today);
    while (takenDates.has(format(currentDate, "yyyy-MM-dd")) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }; */

  const fetchMedications = async () => {
    const { data, error } = await supabase.from("medication_list").select("*");
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setMedications(data || []);
      const taken = (data || []).filter((med) => med.takenToday).length;
      setTotalTakenCount(taken);
    }
  };

  const toggleTaken = async (med) => {
    const updated = !med.takenToday;
    const { error } = await supabase
      .from("medication_list")
      .update({ takenToday: updated })
      .eq("id", med.id);
    if (!error) fetchMedications();
  };

  const totalMeds = medications.length;
  const takenMeds = medications.filter((med) => med.takenToday).length;
  const adherence =
    totalMeds === 0 ? 0 : Math.round((takenMeds / totalMeds) * 100);

  const navigate = useNavigate();
  const handleNavigate = () => navigate("/AddMedicationForm");

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
              !
            </h2>
            <p className="text-white/90 text-lg">
              Ready to stay on track with your medication?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{totalMeds}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{takenMeds} </div>
            <div className="text-white/80">Today's Medications</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              <p>
                {totalMeds === 0 ? "No medications added." : `${adherence}%`}
              </p>
              <div className="text-white/80">Monthly Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
        {/* Left Side - Main Content */}
        <div className="lg:col-span-2">
          <Card className="h-fit w-full">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-base sm:text-2xl">
                {/* Title & Date */}
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>
                    {isTodaySelected
                      ? "Today's Medication"
                      : `Medication for ${format(
                          selectedDate,
                          "MMMM d, yyyy"
                        )}`}
                  </span>
                </div>

                {/* Add Medicine Button - aligned right on mobile */}
                <div className="flex justify-end sm:justify-start w-full sm:w-auto">
                  <button
                    onClick={handleNavigate}
                    id="button-ptn"
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700 transition w-full sm:w-auto"
                  >
                    Add medicine
                  </button>
                </div>
              </CardTitle>

              {/* Medication List */}
              <AddMedicationList
                medications={medications}
                toggleTaken={(i) => toggleTaken(i)}
              />
            </CardHeader>

            <CardContent>
              <MedicationTracker
                date={selectedDateStr}
                isTaken={isSelectedDateTaken}
                onMarkTaken={handleMarkTaken}
                isToday={isTodaySelected}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(today));
                    const isCurrentDay = isToday(date);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                        )}
                      </div>
                    );
                  },
                }}
              />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Medication taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Missed medication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
